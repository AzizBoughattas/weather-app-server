const express = require("express");
const app = express();
const config = require("config");
const mongoose = require("mongoose");
const temperature = require("./routes/temperature");
const cors = require("cors");

if (!config.get("apiKey")) {
  console.log("FATAL ERROR : NO API KEY PROVIDED");
}

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/weather-app")
  .then(() => console.log("connected"))
  .catch(() => console.error("could not connect"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  next();
});
app.use(cors());

app.use("/api/temperature", temperature);
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
