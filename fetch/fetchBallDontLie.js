const fetch = require("node-fetch");
const config = require("config");
const bdlKey = config.get("bdlKey");
const nbaYear = config.get("nbaYear");

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
  // make request to bdl-api for players' stats
  console.log("Fetching Current Season Data...");

  const mongo_players = await Player.find();
  const mongo_ids = mongo_players.map((m_p) => m_p.player_id);
  console.log(
    "There are a total of ",
    mongo_ids.length,
    "players found who will be updated."
  );

  try {
    const urls = [];
    while (mongo_ids.length) {
      const batched_ids = mongo_ids.splice(0, 20);
      const batch_url = new URL(
        "https://api.balldontlie.io/v1/season_averages"
      );
      batch_url.searchParams.append("season", nbaYear);
      batched_ids.forEach((id) => {
        batch_url.searchParams.append("player_ids[]", id);
      });
      urls.push(batch_url);
    }
    const headers = new Headers();
    headers.append("Authorization", bdlKey);
    const options = {
      method: "GET",
      headers: headers,
    };

    let urlCount = 0;
    const bdl_stats = [];
    const batched_stats = await Promise.all(
      urls.map(async (url) => {
        const batchNum = ++urlCount;
        console.log(`Batch #${batchNum}: Beginning to fetch`);
        const res = await fetch(url, options);
        console.log(`Batch #${batchNum}: Received response`);
        const resJson = await res.json();
        console.log(
          `Batch#${batchNum}: Finished processing json, returning promise`
        );
        return resJson;
      })
    );

    batched_stats.forEach((batch) => {
      bdl_stats.push(...batch.data);
    });

    return { mongo_players, bdl_stats };
  } catch (err) {
    console.error("Error fetching player data");
    throw err;
  } // Don't update the DB if there was an error fetching player data
};
module.exports = { fetchEveryPlayerEver, fetchCurrentSeasonData };
