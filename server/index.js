// server/index.js

const DAILY_ADJUSTED = 'TIME_SERIES_DAILY_ADJUSTED';

const MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED';

const express = require("express");

const bodyParser = require("body-parser");

const fetch = require("node-fetch");

const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();

const timePeriod = type =>{
    switch (type) {
      case 'daily':
        return DAILY_ADJUSTED;
      case 'monthly':
        return MONTHLY_ADJUSTED
      default:
        break;
    }
  }
module.exports = timePeriod;

app.post("/stock", cors(), async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { ticker, type } = body;
    console.log("stocks-api.js 14 | body", body.ticker);
    console.log("api key is below...");
    console.log(process.env.ALPHA_VANTAGE_API_KEY);
    const request = await fetch(
        `https://www.alphavantage.co/query?function=${timePeriod(
            type
        )}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    console.log("sent request");
    const data = await request.json();
    res.json({ data: data });
    console.log(data);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});