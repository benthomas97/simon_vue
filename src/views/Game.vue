<template>
<div id="game">
    <h1>Welcome to "Simon"</h1>
		<p>Player name: {{name}}</p>
    <p>Current round: {{roundNum}}</p>
    <p>{{myMessage}}</p>

    <div class="controls">
      <button v-on:click="newGame()">New Game</button>
      <button v-on:click="displayRules()">Rules</button>
    </div>


    <div class="signal" v-bind:style="{backgroundColor: currentSignal}">
    </div>

    <div class="gameControls">
      <button class="button_red" v-on:click="addColor('red')"></button>
      <button class="button_yellow" v-on:click="addColor('yellow')"></button>
      <button class="button_blue" v-on:click="addColor('blue')"></button>
      <button class="button_green" v-on:click="addColor('green')"></button>
    </div>
		<p></p>
		<section class="scoreboard">
			<h2>High scores:</h2>
			<div class="score" v-for="entry in scores" v-bind:key="entry.name">
				{{entry.score}} - {{entry.username}}
			</div>
		</section>

</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'game',
  data() {
		return {
			possible_entries: ['red', 'yellow', 'green', 'blue'],
			computed_pattern: [],
			user_pattern: [],
			myMessage: 'Good luck!',
			currentSignal: 'gray',
			roundNum: 0,
			showingSignal: false,
			name: 'Guest',
			scores: []
		}
  },

  created() {
		this.$store.dispatch("getUser");
		if(this.$store.state.user === null)
			this.name = "Guest";
		else
			this.name = this.$store.state.user.name;
		this.newGame();
  },

  methods: {

    sleep(millis)
    {
			var date = new Date();
			var curDate = null;

			do { curDate = new Date(); }
			while(curDate-date < millis);
    },

    async getScores() {
      try {
				this.error = await this.$store.dispatch("getScores");
        this.scores = this.$store.state.scores;
			}
			catch(error) {
				console.log(error);
			}
    },

    async uploadScore() {
      try {
				var uname;
				if(this.$store.state.user === null)
					uname = 'guest';
				else
					uname = this.$store.state.user.username;
        await axios.post('/api/scores', {
					username: uname,
          name: this.name,
          score: this.roundNum
        });
        console.log('Uploaded new score');
      } catch (error) {
        console.log(error);
      }
		},

    addToPattern()
    {
			this.roundNum++;
			var next = this.possible_entries[Math.floor(Math.random() * Math.floor(4))];
			this.computed_pattern.push(next);
    },

    changeSignal(color, time)
    {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve('resolved');
					this.currentSignal = color;
				}, time);
			});
    },

    async displayPattern()
    {
			this.showingPattern = true;
			for(var index = 0; index < this.computed_pattern.length; index++)
			{
				await this.changeSignal(this.computed_pattern[index], 1000);
				await this.changeSignal('gray', 500);
			}
			this.showingPattern = false;
			this.myMessage = 'Good luck!';
    },

    newGame()
    {
			this.getScores();
			this.computed_pattern = [];
			this.user_pattern = [];
			this.myMessage = 'Good luck!';
			this.roundNum = 0;
			this.addToPattern();
			this.displayPattern();
    },

    checkGame()
    {
	var lostGame = false;
	for(var i = 0; i < this.user_pattern.length; i++)
	{
		if(this.user_pattern[i] != this.computed_pattern[i])
		{
			lostGame = true;
			break;
		}
	}
	if(lostGame)
	{
		this.uploadScore();
		this.newGame();
		this.myMessage = 'You lose! Restarting game.';
	}
	if(!lostGame && this.user_pattern.length === this.computed_pattern.length)
	{
		this.user_pattern = [];
		this.addToPattern();
		this.displayPattern();
	}
    },

    displayRules()
    {
	alert('Rules:\n1. Enter the pattern you see flashed.\n2. Each round, the pattern will get longer.\n3. If you try to enter the pattern while it plays, the game will restart.');
    },

    addColor(color)
    {
	if(this.showingPattern === true)
	{
		this.newGame();
	}
	else
	{
		this.user_pattern.push(color);
		this.checkGame();
	}
    },

  }

}
</script>

<style scoped>
#game {
    font-family: 'Arvo';
    font-size: 16px;
    padding: 20px 100px 0px 100px;
    background: #ffaa00;
}

h1 {
    text-align: center;
}

p {
    text-align: center;
}

.signal {
    margin: 30px auto;
    width: 60px;
    height: 60px;
    
}

.button_red {
    background-color: red;
    margin: 30px;
    width: 60px;
    height: 60px;
}

.button_yellow {
    background-color: yellow;
    margin: 30px;
    width: 60px;
    height: 60px;
}

.button_blue {
    background-color: blue;
    margin: 30px;
    width: 60px;
    height: 60px;
}

.button_green {
    background-color: green;
    margin: 30px;
    width: 60px;
    height: 60px;
}

/* List */

ul {
    list-style: none;
}

li {
    background: #fff;
    width: 500px;
    min-height: 30px;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 1em;
    display: flex;
    align-items: center;
}

.delete {
    display: none;
    margin-left: auto;
}

li:hover .delete {
    display: block;
}

label {
    width: 400px;
}

.completed {
    text-decoration: line-through;
}

/* Form */

input[type=checkbox] {
    transform: scale(1.5);
    margin-right: 10px;
}

input[type=text] {
    font-size: 1em;
}

button {
    font-family: 'Arvo';
    font-size: 1em;
}

/* Controls */

.gameControls {
    width: 500px;
    margin: 0 auto;
}

.controls {
    width: 200px;
    margin: 0 auto;
    text-align: center;
}
</style>
