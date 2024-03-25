"use strict";

const connectDB = require("./config/db");
const { yearlyPlayerSync, dailyStatsUpdate } = require("./updateStats");

module.exports.DailyUpdate = async (event) => {
  await connectDB();
  await dailyStatsUpdate();
  console.log("Daily Stats Update promise is returned");

  return {
    message: "Stats updated!",
    event,
  };
};
