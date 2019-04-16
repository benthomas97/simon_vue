<template>
  <div class="home">
		<div v-if="user">
			<div class="header">
				<div>
					<h1>Welcome, {{user.name}}</h1>
					<a href="#" @click="logout"><i class="fas fa-sign-out-alt"></i></a>
				</div>
			</div>
			<div class="myscores">
				<section class="scoreboard">
					<h2>Personal high scores:</h2>
					<div class="score" v-for="entry in scores" v-bind:key="entry.name">
						{{entry.score}} - {{entry.name}}
					</div>
				</section>
			</div>    
		</div>
		<div v-else>
			<p>Please login or register to see your Simon stats</p>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    
  },
	created() {
		this.$store.dispatch("getUser");
		this.$store.dispatch("getUserScores");
	},
  computed: {
    user() {
      return this.$store.state.user;
    },
		scores() {
			return this.$store.state.myScores;
		}
	},
	methods: {
		async logout() {
			try {
				this.error = await this.$store.dispatch("logout");
			} catch (error) {
				console.log(error);
			}
		},
	},
}
</script>
