var express = require("express");
const app = express();

const film = require("./router/film");
app.use("/api", film).listen(3000, () => {
  console.log("app listening on 3000");
});
