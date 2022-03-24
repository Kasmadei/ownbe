const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const fetch = require("cross-fetch");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('It works!'));

app.get("/test.js", (req, res) => {
  let fileContent = "";
  const filePath = "./test.js";
  const data = fs.readFileSync(filePath, "utf8");
  if (data) {
    fileContent = fileContent + data;
    res.type(".js");
    res.send(fileContent);
  } else {
    res.sendStatus(404);
  }
});

app.post("/payments/standard", (req, res) => {
  const { price, token } = req.body;
  const params = {
    payer: {
      allowed_payment_instruments: ["PAYMENT_CARD"],
      default_payment_instrument: "PAYMENT_CARD",
      allowed_swifts: ["FIOBCZPP", "BREXCZPP"],
      default_swift: "FIOBCZPP",
      contact: {
        first_name: "Kiryl",
        last_name: "Koniukh",
        email: "test@test.cz",
        phone_number: "+420777456123",
        city: "Praha",
        street: "Planá 67",
        postal_code: "37301",
        country_code: "CZE",
      },
    },
    target: {
      type: "ACCOUNT",
      goid: 8360543356,
    },
    items: [
      {
        type: "DISCOUNT",
        name: "Obuv",
        amount: 1,
        count: 1,
        vat_rate: "21",
        ean: 1234567890123,
        product_url: "https://www.eshop.cz/boty/lodicky",
      },
    ],
    amount: price * 100,
    currency: "CZK",
    order_number: "OBJ20200825",
    order_description: "Obuv",
    lang: "CS",
    callback: {
      return_url: "http://localhost:3001/medicines",
    },
    additional_params: [
      {
        name: "invoicenumber",
        value: "2015001003",
      },
    ],
  };

  (async () => {
    try {
      let formBody = [];
      for (const param in params) {
        const encodedKey = encodeURIComponent(param);
        const encodedValue = encodeURIComponent(params[param]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      const response = await fetch(
        "https://gw.sandbox.gopay.com/api/payments/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Request-Method": "POST, OPTIONS, GET",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
          body: JSON.stringify(params),
        }
      );

      if (response) {
        parsedJson = await response.json();
        res.json(parsedJson);
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  })();
});

app.post("/token/bearer", (req, res) => {
  const { clientId, clientSecret } = req.body;
  const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const body = {
    scope: "payment-create",
    grant_type: "client_credentials",
  };

  (async () => {
    try {
      let formBody = [];
      for (const param in body) {
        const encodedKey = encodeURIComponent(param);
        const encodedValue = encodeURIComponent(body[param]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      response = await fetch("https://gw.sandbox.gopay.com/api/oauth2/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicToken}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Request-Method": "POST, OPTIONS, GET",
          "Access-Control-Allow-Headers": "*",
        },
        mode: "cors",
        body: formBody,
      });
    } catch (err) {
      res.sendStatus(500);
    }
    if (response) {
      parsedJson = await response.json();
      res.json({ bearerToken: parsedJson.access_token });
    } else {
      res.sendStatus(500);
    }
  })();
});

app.post("/payments/state", (req, res) => {
  const { id, token } = req.body;
  (async () => {
    try {
      response = await fetch(
        `https://gw.sandbox.gopay.com/api/payments/payment/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Request-Method": "POST, OPTIONS, GET",
            "Access-Control-Allow-Headers": "*",
          },
          mode: "cors",
        }
      );
    } catch (err) {
      res.sendStatus(500);
    }
    if (response) {
      parsedJson = await response.json();
      console.log(parsedJson);
      res.json({
        id: parsedJson.id,
        order_number: parsedJson.order_number,
        state: parsedJson.state,
      });
    } else {
      res.sendStatus(500);
    }
  })();
});

app.listen(process.env.port || port, () => {
  console.log(`Server listening on port: ${port}`);
});
