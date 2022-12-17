const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  player_id: Number,
  cm_name: String,
  season: Number,
  games_played: Number,
  pts: Number,
  reb: Number,
  ast: Number,
  stl: Number,
  blk: Number,
  min: String,
  fgm: Number,
  fga: Number,
  fg3m: Number,
  fg3a: Number,
  ftm: Number,
  fta: Number,
  oreb: Number,
  dreb: Number,
  turnover: Number,
  pf: Number,
  fg_pct: Number,
  fg3_pct: Number,
  ft_pct: Number,
  cm_ts_pct: Number,
  cm_fame: Number,
  cm_3_stat_tot: Number,
  cm_pos: String,
  cm_age: Number,
  cm_team: String,
});

module.exports = Player = mongoose.model('players', PlayerSchema);
