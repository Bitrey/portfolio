// Moduli da richiedere
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");
const fetch = require("node-fetch");
const { stringify } = require("querystring");
const createLocaleMiddleware = require("express-locale");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hsts = require("hsts");
const text = {
    it: require("./locales/it.json"),
    en: require("./locales/en.json")
};
require("dotenv").config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(createLocaleMiddleware());

app.use(helmet());

app.use(
    hsts({
        maxAge: 15552000 // 180 days in seconds
    })
);

// MONGOOSE SETUP
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGODB_URI, function () {
    console.log("Database connesso!");
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
        rejectUnauthorized: false
    }
});

transporter.verify(function (err, success) {
    if (err) {
        console.error(err);
    } else {
        console.log("Email funzionante: " + success);
    }
});

class Message {
    constructor(email) {
        this.from = '"Bitrey.it CONTACT FORM" info@bitrey.it';
        this.to = "alessandro.amella@live.it";
        this.subject = "Bitrey.it Contact Form!";
        this.html = `<span style="font-size: 1.3rem"><strong>NUOVO CONTATTO DA BITREY.IT!</strong><br><br><strong>Nome:</strong> ${email.body.name}<br><strong>Cognome:</strong> ${email.body.surname}<br><strong>Email:</strong> ${email.body.email}<br><strong>Testo:</strong><br>****************************************</span>${email.sanitizedEmail}<br>****************************************`;
    }
}

const sendMail = (body, res, contactText) => {
    const sanitizedEmail = sanitizeHtml(body.text, {
        allowedTags: [
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "p",
            "a",
            "ul",
            "ol",
            "em",
            "u",
            "nl",
            "li",
            "b",
            "i",
            "strong",
            "em",
            "strike",
            "code",
            "hr",
            "del",
            "br",
            "div",
            "s",
            "table",
            "thead",
            "caption",
            "tbody",
            "tr",
            "th",
            "td",
            "pre",
            "iframe",
            "span",
            "dd",
            "dl",
            ,
            "dt",
            "h1",
            "h2",
            "img",
            "sup",
            "sup"
        ]
    });
    const newProject = new Project({
        name: body.name,
        surname: body.surname,
        email: body.email,
        text: sanitizedEmail
    });
    newProject.save(function (err) {
        if (err) {
            // If successful
            res.json({
                success: false,
                reason: "ERROR_DATABASE",
                msg: contactText.ERROR_DATABASE
            });
            console.error(err);
        } else {
            const messageObj = new Message({ body, sanitizedEmail });
            transporter.sendMail(messageObj, function (err, info) {
                if (err) {
                    res.json({
                        success: false,
                        reason: "ERROR_EMAIL",
                        msg: contactText.ERROR_EMAIL
                    });
                    console.log("Errore nell'invio di una mail!");
                    console.error(err);
                } else {
                    res.json({ success: true });
                    console.log("Nuova mail inviata!");
                }
            });
        }
    });
};

app.set("view engine", "ejs");

// BODY PARSER SETUP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SET PUBLIC FOLDER
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    let lang;
    if (req.query.lang && text[req.query.lang]) {
        lang = req.query.lang;
    } else if (req.cookies.lang && text[req.cookies.lang]) {
        lang = req.cookies.lang;
    } else if (req.locale && req.locale.language && text[req.locale.language]) {
        lang = req.locale.language;
    } else {
        lang = "en";
    }
    res.cookie("lang", lang);
    res.redirect(`/${lang}`);
});

app.get("/it", (req, res) => {
    res.cookie("lang", "it");
    res.render("index", { text: text.it });
});

app.get("/en", (req, res) => {
    res.cookie("lang", "en");
    res.render("index", { text: text.en });
});

app.post("/contact", async (req, res) => {
    let lang;
    if (req.cookies.lang && text[req.cookies.lang]) {
        lang = req.cookies.lang;
    } else {
        lang = "en";
    }

    const contactText = text[lang].CONTACT;

    if (!req.body.captcha) {
        return res
            .status(401)
            .json({
                success: false,
                reason: "SOLVE_CAPTCHA",
                msg: contactText.SOLVE_CAPTCHA
            });
    }

    // Secret key
    const secretKey = process.env.SECRET_KEY;

    // Verify URL
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(res => res.json());

    // If not successful
    if (body.success !== undefined && !body.success)
        return res
            .status(401)
            .json({
                success: false,
                reason: "FAILED_CAPTCHA",
                msg: contactText.FAILED_CAPTCHA
            });

    sendMail(req.body, res, contactText);
});

const server = app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server partito!");
});
