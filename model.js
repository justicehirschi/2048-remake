const mongoose = require("mongoose");

mongoose.connect("mongodb://jhirschi:123456a@ds245677.mlab.com:45677/2048_scores_db", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const highScoreSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true]
    },
    score: {
        type: Number,
        required: [true]
    }
});

const Score = mongoose.model("Score", highScoreSchema);

module.exports = {
    Score: Score
};