// Moduli da richiedere
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sanitizeHtml = require('sanitize-html');
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

class Message {
    constructor(body){
        this.from = "\"Bitrey.it CONTACT FORM\" info@bitrey.it";
        this.to = "alessandro.amella@live.it";
        this.subject = 'Bitrey.it Contact Form!';
        this.html = `<span style="font-size: 1.3rem"><strong>NUOVO CONTATTO DA BITREY.IT!</strong><br><br><strong>Nome:</strong> ${body.name}<br><strong>Cognome:</strong> ${body.surname}<br><strong>Email:</strong><br>****************************************</span>${sanitizeHtml(body.text, {
            allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'em', 'u',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'del', 'br', 'div', 's',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span',
                'dd', 'dl', , 'dt', 'h1', 'h2', 'img', 'sup', 'sup' ]
        })}<br>****************************************`;
    }
}

function sendMail(body){
    let messageObj = new Message(body);
    transporter.sendMail(messageObj, function(err, info){
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

// SET PUBLIC FOLDER
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/contact", (req, res) => {
    setTimeout(() => {
        sendMail(req.body);
        res.send("Ok");
    }, 2000);
});

const server = app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server partito!");
})