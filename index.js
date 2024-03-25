const connectDB = require("./config/db");
const { yearlyPlayerSync, dailyStatsUpdate } = require("./updateStats");

// Uncomment this block for manual use
/* 
let manualDailyUpdate = async () => {
  await connectDB();
  await dailyStatsUpdate();
  console.log("Daily Stats Update promise is returned");
};

manualDailyUpdate();
*/

module.exports.handler = async (event) => {
  await connectDB();
  await dailyStatsUpdate();
  console.log("Daily Stats Update promise is returned");
  return {
    message: "Stats updated!",
    event,
  };
};
