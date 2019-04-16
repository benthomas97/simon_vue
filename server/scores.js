const express = require('express');
const bodyParser = require("body-parser");
const axios = require('axios');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

router.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/simonscoreboard', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const scoreSchema = new mongoose.Schema({
	username: String,
  name: String,
  score: Number,
});
const Score = mongoose.model('Score', scoreSchema);

router.post('/', async (req, res) => {
  const score = new Score({
		username: req.body.username,
    name: req.body.name,
    score: req.body.score,
  });
  try {
    await score.save();
    res.send(score);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
		const MAX_SCORES = 5;
    let scores = await Score.find();
		scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
		scores = scores.slice(0, MAX_SCORES);
    res.send(scores);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/:username', async (req, res) => {
	try {
		const MAX_SCORES = 5;
		let scores = await Score.find({username: req.params.username});
		scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
		scores = scores.slice(0, MAX_SCORES);
		res.send(scores);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});
module.exports = {
	model: Score,
	routes: router,
}
