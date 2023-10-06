require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  console.log(firstname, lastname, email);

  // Perform data validation here

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/e287d167f1/";

  const options = {
    method: "POST",
    auth: "aniket:" + process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    let responseBody = "";

    response.on("data", function (data) {
      responseBody += data;
    });

    response.on("end", function () {
      const parsedResponse = JSON.parse(responseBody);

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
        console.error("Mailchimp API Error:", parsedResponse);
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Port started on 3000!");
});
