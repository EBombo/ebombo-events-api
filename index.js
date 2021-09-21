const { api } = require("./api");
const PORT = process.env.PORT || 8080;

console.log("PORT to listen", PORT);

api.listen(PORT, () => console.log(`graphviz-web listening on port ${PORT}`));
