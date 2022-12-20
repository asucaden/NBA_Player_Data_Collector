const https = require('https');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Player = require('./models/Player');
const mapBdlToModel = require('./utils/mapBdlToModel');

const grabAllPlayers = async () => {
  let bdl_players = [];
  let page = 1;
  let url = new URL('https://balldontlie.io/api/v1/players');
  url.searchParams.append('per_page', 100);
  url.searchParams.append('page', page);
  let inProgress = true;
  try {
    do {
      await fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.data.length > 0) {
            console.log('Reading page ' + page);
            bdl_players.push(...json.data);
          } else {
            inProgress = false;
            console.log(
              'finished reading! There were ' + page + ' pages total.'
            );
          }
        })
        .then(() => {
          page++;
          url.searchParams.set('page', page);
        });
    } while (inProgress);

    // Grab mongo players from DB
    console.log('Grabbing mongo players from db');
    const mongo_players = await Player.find();

    // Add bdl's id to mongo players
    console.log('Adding bdl ids to mongo players');
    let bdl_match;
    mongo_players.forEach(m_p => {
      bdl_match = bdl_players.find(b_p => {
        return `${b_p.first_name} ${b_p.last_name}` == m_p.cm_name;
      });
      if (bdl_match) {
        m_p.player_id = bdl_match.id;
        console.log(`match found for player ${m_p.cm_name}`);
      } else {
        console.log(`no match found for player ${m_p.cm_name}`);
      }
    });

    //// Add bdl's stats to mongo players
    // get array of mongo player ids
    const mongo_ids = mongo_players.map(m_p => m_p.player_id);
    // make request to bdl for those player's stats
    const bdl_stats = [];
    url = new URL('https://www.balldontlie.io/api/v1/season_averages');
    while (mongo_ids.length > 0) {
      const chunk_ids = mongo_ids.splice(0, 25);
      url.searchParams.set('player_ids[]', chunk_ids);
      console.log('Calling api to get season stats for matched players');
      await fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.data.length > 0) {
            console.log('Reading stats page');
            bdl_stats.push(...json.data);
          } else {
            inProgress = false;
            console.log('finished reading a stats return!');
          }
        });
    }
  } catch (err) {
    return console.log(err); // Don't update db if there is some error.
  }
  // parse those stats and assign the stats to the mongo players
  // and update the mongo players in the database
  let bdl_stat_match;
  if (bdl_stats) {
    mongo_players.forEach(m_p => {
      bdl_stat_match = bdl_stats.find(b_p => {
        return b_p.player_id === m_p.player_id;
      });
      if (bdl_stat_match) {
        mapBdlToModel(bdl_stat_match, m_p);
        m_p.save();
        console.log(`saved player ${m_p.cm_name} properly!`);
      } else {
        console.log(
          `didnt find a player id (maybe player is unsigned). player was ${m_p.cm_name}`
        );
      }
    });
    console.log('All players are saved now...');
  } else {
    console.log(
      'There was no results from the season stats api call so i gave up early'
    );
  }
};

const dailyUpdatePlayers = async () => {
  /// Grab mongo players from DB
  console.log('Grabbing mongo players from db');
  const mongo_players = await Player.find();

  /// Grab stats from balldontlie
  // Get array of mongo player ids
  const mongo_ids = mongo_players.map(m_p => m_p.player_id);
  // make request to bdl for those player's stats
  const bdl_stats = [];
  try {
    url = new URL('https://www.balldontlie.io/api/v1/season_averages');
    while (mongo_ids.length > 0) {
      const chunk_ids = mongo_ids.splice(0, 25);
      url.searchParams.set('player_ids[]', chunk_ids);
      console.log('Calling api to get season stats for matched players');
      await fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.data.length > 0) {
            console.log('Reading stats page');
            bdl_stats.push(...json.data);
          } else {
            inProgress = false;
            console.log('finished reading a stats return!');
          }
        });
    }
  } catch (err) {
    return console.log(err);
  }

  // parse those stats and assign the stats to the mongo players
  // and update the mongo players in the database
  let bdl_stat_match;
  if (bdl_stats) {
    mongo_players.forEach(m_p => {
      bdl_stat_match = bdl_stats.find(b_p => {
        return b_p.player_id === m_p.player_id;
      });
      if (bdl_stat_match) {
        mapBdlToModel(bdl_stat_match, m_p);
        m_p.save();
        console.log(`saved player ${m_p.cm_name} properly!`);
      } else {
        console.log(
          `didnt find a player id match which shouldnt happen. player was ${m_p.cm_name}`
        );
      }
    });
    console.log(
      'Not sure exactly how async works for nodejs but all players should be saved now...'
    );
  } else {
    console.log(
      'There was no results from the season stats api call so i gave up early'
    );
  }
};

module.exports = { grabAllPlayers, dailyUpdatePlayers };
