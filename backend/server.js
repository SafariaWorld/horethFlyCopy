const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dbo = require('./db/conn');
const leaderboardRouter = require('./routes/leaderboards');


app.use(express.static(path.join(__dirname + '/build')));
app.use(express.json());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname + '/assets')));
app.use("/leaderboard", leaderboardRouter);


// viewed at based directory http://localhost:8080/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'build/index.html'));
});

dbo.connectToServer((err) => {
  if(err) {
    console.log(err);
    process.exit();
  }

  app.listen(process.env.PORT || 8080);
})