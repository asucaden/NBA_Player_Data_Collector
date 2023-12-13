const connectDB = require("./config/db");
const { yearlyPlayerSync, dailyStatsUpdate } = require("./updateStats");

let manualDailyUpdate = async () => {
  await connectDB();
  dailyStatsUpdate();
};

manualDailyUpdate();
