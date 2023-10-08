const express = require("express");
const { Temperature } = require("../models/temperature");
const router = express.Router();
const config = require("config");
const axios = require("axios");

router.post("/", async (req, res) => {
  const ville = req.body.ville;
  const unit = req.body.unit;

  if (unit !== "metric" && unit !== "imperial") {
    return res.status(400).send("Please provide a valid unit");
  }

  const temperature = await Temperature.findOne({
    ville: ville.toLowerCase(),
    unit,
  });

  if (temperature) {
    return res.send(temperature);
  }

  const apiKey = config.get("apiKey");
  const APIUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${ville}&timesteps=1d&units=${unit}&apikey=${apiKey}`;

  let arrayTemp = [];
  try {
    const response = await axios.get(APIUrl);
    for (let weather of response.data.timelines.daily) {
      arrayTemp.push(Math.round(weather.values.temperatureApparentAvg));
    }
    let temperature = new Temperature({
      values: arrayTemp,
      unit,
      ville: ville.toLowerCase(),
    });
    temperature = await temperature.save(temperature);
    res.send(temperature);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  const temperature = await Temperature.findOne({
    ville: "tunis",
    unit: "metric",
  });
  if (!temperature) {
    try {
      let arrayTemp = [];
      const apiKey = config.get("apiKey");
      const APIUrl = `https://api.tomorrow.io/v4/weather/forecast?location=tunis&timesteps=1d&units=metric&apikey=${apiKey}`;
      const response = await axios.get(APIUrl);
      for (let weather of response.data.timelines.daily) {
        arrayTemp.push(Math.round(weather.values.temperatureApparentAvg));
      }
      let temperature = new Temperature({
        values: arrayTemp,
        type: "metric",
        ville: "tunis",
      });
      temperature = await temperature.save(temperature);
      return res.send(temperature);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  res.send(temperature);
});

module.exports = router;
