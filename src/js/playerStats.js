const components = {
  initPlayerStats: initPlayerStats,
  playerStats: {
    data: {},
    getNewPlayer: getNewPlayer
  }
};

function getNewPlayer(playerId) {
  this.data.players.filter((item) => {
    if(item.player.id === parseInt(playerId)) {
      console.log(this, item.player.id, playerId);

      this.currentPlayer = item;
      console.log(this);
      this.findStatHolders = this.componentDiv.querySelectorAll('section.playerStat');

      this.attributes = {};
      this.currentPlayer.stats.forEach((stat) => {
        this.attributes[(stat.name).toLowerCase()] = stat.value;
      });

      this.attributes.goalsPerMatch = parseInt(this.attributes.goals/this.attributes.appearances*100)/100;
      this.attributes.passesPerMinute = parseInt((this.attributes.fwd_pass + this.attributes.backward_pass)/this.attributes.mins_played*100)/100;

      this.selectedAttributes = ['appearances', 'goals', 'goal_assist', 'goalsPerMatch', 'passesPerMinute'];

      this.findStatHolders.forEach((item, i)=> {
        item.querySelectorAll('.statValue')[0].innerHTML = this.attributes[this.selectedAttributes[i]] || 0;
      });

      this.componentDiv.querySelectorAll('h1')[0].innerHTML = this.currentPlayer.player.name.first + ' ' + this.currentPlayer.player.name.last;
      this.componentDiv.querySelectorAll('h2')[0].innerHTML = this.currentPlayer.player.info.position;
      this.componentDiv.querySelectorAll('img')[0].src = '/images/players/p' + this.currentPlayer.player.id + '.png';
      this.componentDiv.querySelectorAll('img')[0].alt = this.currentPlayer.player.name.first + ' ' + this.currentPlayer.player.name.last;
      this.componentDiv.querySelectorAll('img')[1].src = '/images/teams/t' + this.currentPlayer.player.currentTeam.id + '.png';
      this.componentDiv.querySelectorAll('img')[1].alt = this.currentPlayer.player.currentTeam.name;
    }
  });
}

function initPlayerStats(playerId, componentId) {

  this.playerStats.componentDiv = document.getElementById(componentId);

  $.getJSON('/data/player-stats.json')
    .done((data) => {
      this.playerStats.data = data;

      if (this.playerStats.currentPlayer === undefined){
        const selectList = document.getElementById(componentId).querySelectorAll('select.playerSelector')[0];
        selectList.addEventListener('change', (e) => {
          this.playerStats.getNewPlayer(e.target.value, componentId);
        });
        this.playerStats.getNewPlayer(playerId, componentId);

        console.log(this);

        var selectOptions = '';
        data.players.forEach((data) => {
          selectOptions += `<option value="${data.player.id}">${data.player.name.first} ${data.player.name.last}</option>`;
        });
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
