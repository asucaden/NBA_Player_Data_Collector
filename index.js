const connectDB = require('./config/db');
const { grabAllPlayers, dailyUpdatePlayers } = require('./grabBallDontLie');

connectDB();
dailyUpdatePlayers();
