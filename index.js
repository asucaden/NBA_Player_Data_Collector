const connectDB = require("./config/db");
const { yearlyPlayerSync, dailyStatsUpdate } = require("./updateStats");

let manualDailyUpdate = async () => {
  await connectDB();
  await dailyStatsUpdate();
};

manualDailyUpdate();

module.exports.handler = async (event) => {
  await connectDB();
  await dailyStatsUpdate();

  return {
    message: "Stats updated!",
    event,
  };
};
