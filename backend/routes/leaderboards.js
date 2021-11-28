const express = require('express');
const dbo = require('../db/conn');

const leaderboardRouter = express.Router();

leaderboardRouter.route('/').get(async function(req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('scores')
    .find({}).limit(5)
    .sort({ score: -1 })
    .toArray(function(err, result) {
      if (err) throw res.status(400).send("G:Leaderboard Error");
      res.json(result);
    });
});

leaderboardRouter.route('/').post(async function(req, res) {
  const dbConnect = dbo.getDb();
  const { name, score } = req.body;
  dbConnect
    .collection('scores')
    .insertOne({ name, score }, function(err, result) {
      if (err) throw res.status(400).send("P:Leaderboard Error");
      res.json(result);
    });
});

module.exports = leaderboardRouter;