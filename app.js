// Moduli da richiedere
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
});

transporter.verify(function(err, success) {
    if(err){
      console.error(err);
    } else {
      console.log("Email funzionante: " + success);
    }
});

let message = {
    from: "\"Bitrey.it CONTACT FORM\" info@bitrey.it",
    to: "alessandro.amella@live.it",
    subject: 'Bitrey.it Contact Form!',
    html: 'È stato richiesto l\'invio di una mail di prova'
}

function sendMail(){
    transporter.sendMail(message, function(err, info){
        if(err){
            console.log("Errore nell'invio di una mail!");
            console.error(err);
        } else {
            console.log("Nuova mail inviata!");
        }
    });
}

app.set("view engine", "ejs");

// BODY PARSER SETUP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
})

// SET PUBLIC FOLDER
app.use(express.static(__dirname + "/public"));

const server = app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server partito!");
})