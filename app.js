// Moduli da richiedere
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const sanitizeHtml = require('sanitize-html');
const fetch = require('isomorphic-fetch');
require("dotenv").config();

// MONGOOSE SETUP
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGODB_URI, function(){
    console.log("Database connesso!");
});

app.post('/send', (req, res) => {
    const secret_key = process.env.SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => {
            console.log({ google_response });
            res.json({ google_response });
        })
        .catch(error => res.json({ error }));
});

const projectSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    name: String,
    surname: String,
    email: String,
    text: String
});

const Project = mongoose.model("Project", projectSchema);

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
    constructor(email){
        this.from = "\"Bitrey.it CONTACT FORM\" info@bitrey.it";
        this.to = "alessandro.amella@live.it";
        this.subject = 'Bitrey.it Contact Form!';
        this.html = `<span style="font-size: 1.3rem"><strong>NUOVO CONTATTO DA BITREY.IT!</strong><br><br><strong>Nome:</strong> ${email.body.name}<br><strong>Cognome:</strong> ${email.body.surname}<br><strong>Email:</strong> ${email.body.email}<br><strong>Testo:</strong><br>****************************************</span>${email.sanitizedEmail}<br>****************************************`;
    }
}

const sendMail = (body) => {
    const sanitizedEmail = sanitizeHtml(body.text, {
        allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'em', 'u',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'del', 'br', 'div', 's',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span',
            'dd', 'dl', , 'dt', 'h1', 'h2', 'img', 'sup', 'sup' ]
    });
    const newProject = new Project({
        name: body.name,
        surname: body.surname,
        email: body.email,
        text: sanitizedEmail
    });
    newProject.save(function(err){
        if(err){
            console.error(err);
        }
    });
    const messageObj = new Message({body, sanitizedEmail});
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