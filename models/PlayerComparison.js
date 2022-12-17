const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerComparisonSchema = new Schema({
  playerA: {
    Player: String,
    PTS: Number,
    AST: Number,
    TRB: Number,
  },
  playerB: {
    Player: String,
    PTS: Number,
    AST: Number,
    TRB: Number,
  },
});

module.exports = PlayerComparison = mongoose.model(
  'playerComparison',
  playerComparisonSchema
);
