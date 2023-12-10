const fetch = require("node-fetch");

const fetchEveryPlayerEver = async () => {
  let bdl_players = [];
  let page = 1;
  let url = new URL("https://balldontlie.io/api/v1/players");
  url.searchParams.append("per_page", 100);
  url.searchParams.append("page", page);

  try {
    while (page < 200) {
      const res = await fetch(url);
      const json = await res.json();
      if (json.data.length === 0) {
        console.log("finished reading! There were " + page + " pages total.");
        return bdl_players;
      }
      console.log("Reading page " + page);
      bdl_players.push(...json.data);
      url.searchParams.set("page", ++page);
    }
  } catch (err) {
    throw err;
  } // Don't update the DB if there was an error fetching player data
  console.error("Supposedly parsed 20,000 players, something's wrong");
};

const fetchCurrentSeasonData = async () => {
  // make request to bdl for those player's stats
  console.log("Grabbing mongo players from db");
  const mongo_players = await Player.find();
  const mongo_ids = mongo_players.map((m_p) => m_p.player_id);
  const bdl_stats = [];
  try {
    url = new URL("https://www.balldontlie.io/api/v1/season_averages");
    while (mongo_ids.length > 0) {
      const chunk_ids = mongo_ids.splice(0, 100);
      console.log(chunk_ids);
      url.searchParams.set("player_ids[]", chunk_ids);

      console.log("Fetching a page of season averages");
      console.log("URL: " + url);
      const res = await fetch(url);
      const json = await res.json();
      console.log("JSON is " + json);
      if (json.data.length === 0) {
        console.log("Fetched all season averages");
        console.log(
          "Fetched all season averages, " +
            mongo_players.length +
            " total players fetched." +
            bdl_stats +
            "bdl players fetched."
        );
        return { mongo_players, bdl_stats };
      }
      console.log("Reading stats page");
      bdl_stats.push(...json.data);
    }
  } catch (err) {
    console.error("Error fetching player data");
    throw err;
  } // Don't update the DB if there was an error fetching player data
  console.log(
    "Fetched all season averages, " +
      mongo_players.length +
      " total players fetched." +
      bdl_stats.length +
      "bdl players fetched."
  );
  return { mongo_players, bdl_stats };
};

module.exports = { fetchEveryPlayerEver, fetchCurrentSeasonData };
