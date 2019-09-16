const routes = require("./routes");
const DB = require("./database.js");
const express = require("express");
const bodyParser = require("body-parser");

const db = new DB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  req.context = {
    db: db
  };
  next();
});
app.use("/", routes);

app.listen(3000, () => console.log(`App listening on port 3000!`));
