const connectDB = require('./config/db');
const { yearlyPlayerSync, dailyStatsUpdate } = require('./updateStats');

connectDB();
dailyStatsUpdate();
