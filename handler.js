'use strict';

const connectDB = require('./config/db');
const { yearlyPlayerSync, dailyStatsUpdate } = require('./updateStats');

module.exports.DailyUpdate = async (event) => {
  await connectDB();
  await dailyStatsUpdate();

  return {
    message: 'Stats updated!',
    event,
  };
};
