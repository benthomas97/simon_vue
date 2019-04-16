import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		user: null,
		scores: [],
		myScores: []
  },
  mutations: {
		setUser(state, user) {
			state.user = user;
		},
	},
  actions: {
		async register(context, data) {
			try {
				let response = await axios.post("/api/users", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async login(context, data) {
      try {
        let response = await axios.post("/api/users/login", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit('setUser', null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        let response = await axios.get("/api/users");
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return "";
      }
		},
		async getScores() {
			try {
				let response = await axios.get("/api/scores");
				this.state.scores = response.data;
				return true;
			} catch (error) {
				console.log(error);
			}
		},
		async getUserScores() {
			try {
				if(this.state.user === null)
					throw "User has not logged in yet.";
				let response = await axios.get("/api/scores/" + this.state.user.username);
				this.state.myScores = response.data;
				return true;
			} catch (error) {
				console.log(error);
			}
		},
	}
});
