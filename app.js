// Moduli da richiedere
const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

// BODY PARSER SETUP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.render("index");
})

// SET PUBLIC FOLDER
app.use(express.static(__dirname + "/public"));

const server = app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server partito!");
})