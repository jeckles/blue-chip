// server/index.js

const DAILY_ADJUSTED = 'TIME_SERIES_DAILY';

const MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED';

const EARNINGS = 'EARNINGS';

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

const apiType = type =>{
    switch (type) {
      case 'daily':
        return DAILY_ADJUSTED;
      case 'monthly':
        return TIME_SERIES_MONTHLY_ADJUSTED;
      case 'earnings':
          return EARNINGS;
      default:
        break;
    }
  };

app.post("/stock", cors(), async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { ticker, type } = body;
    console.log("stocks-api.js 14 | body", body.ticker);
    const request = await fetch(
        `https://www.alphavantage.co/query?function=${apiType(
            type
        )}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await request.json();
    res.json({ data: data });
    console.log(data);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});