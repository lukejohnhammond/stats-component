const components = {
  playerStats: {
    initPlayerStats,
    getNewPlayer,
    checkPosition
  }
};

function getNewPlayer(playerId, componentId) {
  const component = this[componentId];
  const componentDiv = component.componentDiv;
  const player = component.data[playerId];

  // get dom elems and set requested attrs
  component.findStatHolders = componentDiv.querySelectorAll('section.playerStat');
  component.selectedAttr = ['appearances', 'goals', 'goal_assist', 'goalsPerMatch', 'passesPerMinute'];

  // populate attrs
  component.findStatHolders.forEach((item, i)=> {
    item.querySelectorAll('.statValue')[0].innerHTML = player[component.selectedAttr[i]] || 0;
  });

  // populate other dom elems as required
  componentDiv.querySelectorAll('h1')[0].innerHTML = player.name;
  componentDiv.querySelectorAll('h2')[0].innerHTML = player.position;
  componentDiv.querySelectorAll('img')[0].src = player.playerImage;
  componentDiv.querySelectorAll('img')[0].alt = player.name;
  componentDiv.querySelectorAll('img')[1].src = player.teamImage;
  componentDiv.querySelectorAll('img')[1].alt = player.teamName;
}

function checkPosition(pos) {
  switch (pos) {
    case 'D':
      return 'Defence';
    case 'M':
      return 'Midfield';
    case 'F':
      return 'Forward';
  }
}

function initPlayerStats(playerId, componentId) {
  this[componentId] = {
    componentDiv: document.getElementById(componentId)
  };
  const instance = this[componentId];
  const componentDiv = instance.componentDiv;

  $.getJSON('/data/player-stats.json')
    .done((data) => {
      // Define some defaults
      var selectOptions = '';
      let firstPlayerId = 0;
      instance.data = {};

      // Log relevant info for each player
      data.players.forEach((item) => {
        // Set first loaded player id
        if(firstPlayerId === 0) firstPlayerId = item.player.id;

        // Get attributes
        instance.data[item.player.id] = {
          name: item.player.name.first + ' ' + item.player.name.last,
          position: this.checkPosition(item.player.info.position),
          playerImage: '/images/players/p' + item.player.id + '.png',
          teamImage: '/images/teams/t' + item.player.currentTeam.id + '.png',
          teamName: item.player.currentTeam.name
        };

        // define object as player for easy reading
        const player = instance.data[item.player.id];

        // get player stats and reformat (to avoid missing and misaligned array values)
        item.stats.forEach((stat) => {
          player[(stat.name).toLowerCase()] = stat.value;
        });
        player.goalsPerMatch = parseInt(player.goals/player.appearances*100)/100;
        player.passesPerMinute = parseInt((player.fwd_pass + player.backward_pass)/player.mins_played*100)/100;

        // write select options for dropdown
        selectOptions += `<option value="${item.player.id}">${item.player.name.first} ${item.player.name.last}</option>`;
      });

      // Set up select list and event listener
      const selectList = componentDiv.querySelectorAll('select.playerSelector')[0];
      selectList.addEventListener('change', (e) => {
        this.getNewPlayer(e.target.value, componentId);
      });
      selectList.innerHTML = selectOptions;

      // Populate first loaded player
      this.getNewPlayer(firstPlayerId, componentId);
    })
    .fail((jqxhr, textStatus, error) => {
      var err = textStatus + ',' + error;
      console.log( 'Request Failed: ' + err );
    });
}

document.addEventListener('DOMContentLoaded', () => {
  components.playerStats.initPlayerStats(4916, 'stats1');
});
