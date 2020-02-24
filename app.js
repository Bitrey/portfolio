// Moduli da richiedere
const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

// BODY PARSER SETUP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.status(200).send("Hello World!");
})

const server = app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server partito!");
})