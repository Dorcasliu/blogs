//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Codename Villanelle. Publisher's Summary: She is the perfect assassin. A Russian orphan, saved from the death penalty for the brutal revenge she took on her gangster father's killers. Ruthlessly trained. Given a new life. New names, new faces - whichever fits. Her paymasters call themselves The Twelve. But she knows nothing of them. Konstantin is the man who saved her and the one she answers to. She is Villanelle. Without conscience. Without guilt. Without weakness. Eve Polastri is the woman who hunts her. MI5, until one error of judgment costs her everything. Then stopping a ruthless assassin becomes more than her job. It becomes personal. ©2018 Luke Jennings (P)2018 W. F. Howes Ltd.";

const aboutContent = "Codename Villanelle is a 2018 thriller novel by British author Luke Jennings. A compilation of four serial e-book novellas published in 2014–2016, Codename Villanelle is the basis of BBC America's television series Killing Eve which debuted in April 2018. Villanelle is a Russian orphan who, after murdering the killers of her gangster father, is rescued from prison and trained as a hitwoman by a shadowy group called The Twelve. Codename Villanelle has been summarized as pitting \"heartless female assassin\" Villanelle against \"dowdy but dogged MI5 agent\" Eve Polastri, the two women \"battling it out at a distance\" as Polastri seeks clues at a series of killing sites.";
const contactContent = "Author	Luke Jennings. Language	English. Genre	Fiction, thriller, suspense. Publisher	Mulholland Books, an imprint of Little, Brown and Company. Publication date	3 April 2018. Media type	Hardcover, Kindle, audiobook. Pages	224. ISBN	978-0-316-51252-7. Followed by	Killing Eve: No Tomorrow. Website	http://www.lukejennings.com.";


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extends: true
}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res) {
  res.render("home", {
    homeText: homeStartingContent,
    getPost: posts
  });

});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutText: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactText: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  posts.forEach(function(post) {
    const storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
