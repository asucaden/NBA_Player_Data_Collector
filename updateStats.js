const Player = require("./models/Player");
const mapBdlToModel = require("./utils/mapBdlToModel");
const {
  fetchEveryPlayerEver,
  fetchCurrentSeasonData,
} = require("./fetch/fetchBallDontLie");

// Called literally 1x per YEAR.
// Map players to ids in a way that accounts for balldontlie api's quirkiness
const yearlyPlayerSync = async () => {
  console.log("Grabbing mongo players from db");
  const mongo_players = await Player.find();
  const bdl_players = await fetchEveryPlayerEver();

  console.log("Assigning bdl ids to mongo players");
  mongo_players.forEach((m_p) => {
    const bdl_match = bdl_players.find((b_p) => {
      return `${b_p.first_name} ${b_p.last_name}` === m_p.cm_name;
    });
    if (bdl_match) {
      m_p.player_id = bdl_match.id;
      console.log(`match found for player ${m_p.cm_name}`);
    } else {
      console.error(`\nno match found for player ${m_p.cm_name}\n`);
    }
  });

  mongo_players.forEach((m_p) => {
    if (!m_p.cm_fame) {
      console.log(
        `${m_p.cm_name} doesn't have a fame set. Setting fame to 1000.`
      );
      m_p.cm_fame = 1000;
    }
    m_p.save();
  });
  console.log("All players updated");
  return;
};

// Fetch BallDontLie stats, assign stats to the mongo players
const dailyStatsUpdate = async () => {
  const { mongo_players, bdl_stats } = await fetchCurrentSeasonData();

  if (bdl_stats) {
    mongo_players.forEach((m_p) => {
      const bdl_stat_match = bdl_stats.find((b_p) => {
        return b_p.player_id === m_p.player_id;
      });
      if (bdl_stat_match) {
        mapBdlToModel(bdl_stat_match, m_p);
        m_p.save();
        console.log(`saved player ${m_p.cm_name} successfully`);
      } else {
        console.error(
          `\nNo match found for a mongo player ID. Player was ${m_p.cm_name}\n`
        );
      }
    });
    console.log("All players updated");
  } else {
    console.error("No players found");
  }
  return;
};

module.exports = { yearlyPlayerSync, dailyStatsUpdate };
