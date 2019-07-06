const bodyParser = require("body-parser");
const express = require("express");
const model = require("./model.js");
const cors = require("cors");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var corsOrigin = "null" // localhost
// var corsOrigin = "https://justicehirschi.github.io" // heroku server

app.use(cors({credentials: true, origin: `${corsOrigin}`})); 
app.set("port", (process.env.PORT || 8080));
app.use(express.static("public"));

app.get("/scores", function(request, response) {
    model.Score.find({}).then(function (scores) {
        response.json(scores);
    });
});

app.post("/scores", function(request, response) {
    console.log("Body:", request.body);

    let score = new model.Score({
        name: request.body.name,
        score: request.body.score,
    });

    if(request.body.name != "" && request.body.score != "") {
        score.save().then(function() {
            response.sendStatus(201);
        });
    }
});

app.listen(app.get("port"), function() {
    console.log("Listening...");
});