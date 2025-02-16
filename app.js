const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.port || 5000;

const mongoURI = "mongodb://localhost:27017/crudapp";



// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create schema for high score
const highScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

const HighScore = mongoose.model("HighScore", highScoreSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});


// Handle the form submission (POST request)
app.post("/submit", (req, res) => {
  console.log(req.body);  // Debugging line to check if data is sent correctly
  const { name, score } = req.body;

  // Simple validation
  if (!name || !score) {
    return res.status(400).json({ message: "Name and score are required" });
  }

  // Create a new high score document
  const newHighScore = new HighScore({ name, score });

  // Save to the database
  newHighScore
    .save()
    .then(() => {
      res.status(200).json({ message: "High score submitted successfully" });
    })
    .catch((error) => {
      console.error("Error saving high score:", error);
      res.status(500).json({ error: error.message });
    });

});

// Route to get high scores
app.get("/highscores", async (req, res) => {
    try {
        const highScores = await HighScore.find().sort({ score: -1 }).limit(10); // Sort by score, limit to top 10
        res.json(highScores);
    } catch (error) {
        console.error("Error fetching high scores:", error);
        res.status(500).json({ error: "Failed to fetch high scores" });
    }
});


// Error handler for 404
app.use((req, res, next) => {
  res.status(404).json({ error: 404, message: "Route not found." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
