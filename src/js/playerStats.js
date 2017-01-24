const components = {
  initPlayerStats: function (playerId, componentId) {
    $.getJSON('/data/player-stats.json')
      .done((data) => {
        data.players.filter((item) => {
          if(item.player.id === playerId) {
            this.playerStats = {
              currentPlayer: item
            };
          }

          this.playerStats.findStatHolders =  document.getElementById(componentId).querySelectorAll('section.playerStat');
          this.playerStats.attributes = [
            this.playerStats.currentPlayer.stats[6].value,
            this.playerStats.currentPlayer.stats[0].value,
            this.playerStats.currentPlayer.stats[5].value,
            parseInt(this.playerStats.currentPlayer.stats[0].value/this.playerStats.currentPlayer.stats[6].value*100)/100,
            parseInt((this.playerStats.currentPlayer.stats[8].value + this.playerStats.currentPlayer.stats[4].value)/this.playerStats.currentPlayer.stats[7].value*100)/100
          ];

          this.playerStats.findStatHolders.forEach((item, i)=> {
            item.querySelectorAll('.statValue')[0].innerHTML = this.playerStats.attributes[i];
          });

          console.log(this);
        });
      })
      .fail((jqxhr, textStatus, error) => {
        var err = textStatus + ',' + error;
        console.log( 'Request Failed: ' + err );
      });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  components.initPlayerStats(4916, 'stats1');
});
