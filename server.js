require("dotenv").config();
require("./database").connect("");
const express = require("express");
const redis = require("redis");
const User = require("./model");
const app = express();
const port = process.env.PORT || 4000;

let redisClient;

(async () => {
  redisClient = redis.createClient({legacyMode: true});

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect().then(console.log("redis connected"));
})();

function redisGet(res) {
  return new Promise((resolve, reject) => {
    redisClient.get("user", (err, reply) => {
      if(err) {
        console.log(err);
      } else if (reply) {
        const parsedJson = JSON.parse(reply);
        res.json({
          storageused: "redis",
          status: "success",
          message: "Contacts retrieved successfully",
          data: parsedJson,
        })
      } else {
        User.get(function (err, user) {
          console.log("db used");
          if (err) {
            res.json({
              status: "error",
              message: err,
            });
          } else {
            redisClient.set("user", JSON.stringify(user));
            res.json({
              storageused: "mongodb",
              status: "success",
              message: "Contacts retrieved successfully",
              data: user,
            });
          }
        });
      }
    })
  });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/getall", async (req, res) => {
  await redisGet(res);
});
