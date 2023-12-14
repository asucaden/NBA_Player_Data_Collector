const mapBdlToModel = (bdlPlayer, mongoPlayer) => {
  mongoPlayer.season = bdlPlayer.season;
  mongoPlayer.games_played = bdlPlayer.games_played;
  mongoPlayer.pts = bdlPlayer.pts;
  mongoPlayer.reb = bdlPlayer.reb;
  mongoPlayer.ast = bdlPlayer.ast;
  mongoPlayer.stl = bdlPlayer.stl;
  mongoPlayer.blk = bdlPlayer.blk;
  mongoPlayer.min = bdlPlayer.min;
  mongoPlayer.fgm = bdlPlayer.fgm;
  mongoPlayer.fga = bdlPlayer.fga;
  mongoPlayer.fg3m = bdlPlayer.fg3m;
  mongoPlayer.fg3a = bdlPlayer.fg3a;
  mongoPlayer.ftm = bdlPlayer.ftm;
  mongoPlayer.fta = bdlPlayer.ftm;
  mongoPlayer.oreb = bdlPlayer.oreb;
  mongoPlayer.dreb = bdlPlayer.dreb;
  mongoPlayer.turnover = bdlPlayer.turnover;
  mongoPlayer.pf = bdlPlayer.pf;
  mongoPlayer.fg_pct = bdlPlayer.fg_pct;
  mongoPlayer.fg3_pct = bdlPlayer.fg3_pct;
  mongoPlayer.ft_pct = bdlPlayer.ft_pct;

  // Derived stats
  mongoPlayer.cm_3_stat_tot = bdlPlayer.pts + bdlPlayer.reb + bdlPlayer.ast;
  const ans = Number(
    (bdlPlayer.pts / (2 * (bdlPlayer.fga + 0.44 * bdlPlayer.fta))).toFixed(3)
  );
  mongoPlayer.cm_ts_pct = ans ? ans : 0;
};

module.exports = mapBdlToModel;
