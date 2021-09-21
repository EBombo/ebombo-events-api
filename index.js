const { api } = require("./api");
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV;

api.listen(PORT, () => console.log(`Listening on port ${PORT} ${ENV}`));
