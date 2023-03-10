const express = require("express");
const main = require("../scrap/scrap");
const route = express.Router();

route.post("/indeed", async (req, res) => {
  try {
    let skill = req.body.skill;
    console.log("logging skill:", skill);
    let scrp = await main(skill);
    return res.status(200).json({
      status: "ok",
      list: scrp?.list || {},
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});
module.exports = route;
