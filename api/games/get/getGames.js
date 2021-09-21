const logger = require("../../../utils/logger");
const { snapshotToArray } = require("../../../utils");
const { firestore } = require("../../../config");
const fetch = require("node-fetch");
const flatMap = require("lodash/flatMap");

exports.getGames = async (req, res, next) => {
  try {
    logger.log("getGames->", req.params);

    const { userId } = req.params;
    const { folderId } = req.query;

    const gamesAdmin = await fetchGamesAdmin();

    const promises = gamesAdmin.map(async (game) => {
      try {
        let url = `${game.api}/api/games/users/${userId}`;

        if (folderId) url = url + `?folderId=${folderId}`;

        logger.log("game.domain", url);

        const response = await fetch(url, { method: "GET" });

        if (!response.ok) throw Error(response.statusMessage);

        const responseJSON = await response.json();

        return responseJSON;
      } catch (error) {
        logger.error(`fetchGame ${game.name}`, error);
        return null;
      }
    });

    let responses = await Promise.all(promises);
    responses = responses.filter((game) => game);

    logger.log("responses", responses);

    const games = flatMap(responses);

    return res.send({ games });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const fetchGamesAdmin = async () => {
  const gamesRef = await firestore
    .collection("games")
    .where("deleted", "==", false)
    .get();

  return snapshotToArray(gamesRef);
};
