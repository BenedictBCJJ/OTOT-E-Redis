require("dotenv").config();
require("./database").connect("");
const express = require("express");
const redis = require("redis");
const User = require("./model");
const app = express();
const port = process.env.PORT || 4000;

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/getall", (req, res) => {
  User.get(function (err, user) {
    // console.log(user);
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: "Contacts retrieved successfully",
        data: user,
      });
    }
  });
});
