console.log('Works');


$.getJSON('/data/player-stats.json', (data) => {
  console.log(data.players[0]);
});
