const components = {
  initPlayerStats: initPlayerStats,
  playerStats: {
    data: {},
    getNewPlayer: getNewPlayer,
    checkPosition
  }
};

function getNewPlayer(playerId) {
  this.findStatHolders = this.componentDiv.querySelectorAll('section.playerStat');

  this.selectedAttributes = ['appearances', 'goals', 'goal_assist', 'goalsPerMatch', 'passesPerMinute'];

  this.findStatHolders.forEach((item, i)=> {
    item.querySelectorAll('.statValue')[0].innerHTML = this.data[playerId][this.selectedAttributes[i]] || 0;
  });

  this.componentDiv.querySelectorAll('h1')[0].innerHTML = this.data[playerId].name;
  this.componentDiv.querySelectorAll('h2')[0].innerHTML = this.data[playerId].position;
  this.componentDiv.querySelectorAll('img')[0].src = this.data[playerId].playerImage;
  this.componentDiv.querySelectorAll('img')[0].alt = this.data[playerId].name;
  this.componentDiv.querySelectorAll('img')[1].src = this.data[playerId].teamImage;
  this.componentDiv.querySelectorAll('img')[1].alt = this.data[playerId].teamName;
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

  this.playerStats.componentDiv = document.getElementById(componentId);

  $.getJSON('/data/player-stats.json')
    .done((data) => {
      // this.playerStats.data = data;
      var selectOptions = '';
      let firstPlayerId = 0;
      this.playerStats.data = {};
      data.players.forEach((item) => {

        if(firstPlayerId === 0) firstPlayerId = item.player.id;

        this.playerStats.data[item.player.id] = {
          name: item.player.name.first + ' ' + item.player.name.last,
          position: this.playerStats.checkPosition(item.player.info.position),
          playerImage: '/images/players/p' + item.player.id + '.png',
          teamImage: '/images/teams/t' + item.player.currentTeam.id + '.png',
          teamName: item.player.currentTeam.name
        };

        item.stats.forEach((stat) => {
          this.playerStats.data[item.player.id][(stat.name).toLowerCase()] = stat.value;
        });

        this.playerStats.data[item.player.id].goalsPerMatch = parseInt(this.playerStats.data[item.player.id].goals/this.playerStats.data[item.player.id].appearances*100)/100;
        this.playerStats.data[item.player.id].passesPerMinute = parseInt((this.playerStats.data[item.player.id].fwd_pass + this.playerStats.data[item.player.id].backward_pass)/this.playerStats.data[item.player.id].mins_played*100)/100;

        selectOptions += `<option value="${item.player.id}">${item.player.name.first} ${item.player.name.last}</option>`;
      });

      if (this.playerStats.currentPlayer === undefined){
        const selectList = document.getElementById(componentId).querySelectorAll('select.playerSelector')[0];
        selectList.addEventListener('change', (e) => {
          this.playerStats.getNewPlayer(e.target.value, componentId);
        });
        this.playerStats.getNewPlayer(firstPlayerId, componentId);

        selectList.innerHTML = selectOptions;
      }
    })
    .fail((jqxhr, textStatus, error) => {
      var err = textStatus + ',' + error;
      console.log( 'Request Failed: ' + err );
    });
}

document.addEventListener('DOMContentLoaded', () => {
  components.initPlayerStats(4916, 'stats1');
});
