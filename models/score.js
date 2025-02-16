const mongoose = require("mongoose");

const highScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

const HighScore = mongoose.model("HighScore", highScoreSchema);


