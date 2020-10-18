//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Codename Villanelle. Publisher's Summary: She is the perfect assassin. A Russian orphan, saved from the death penalty for the brutal revenge she took on her gangster father's killers. Ruthlessly trained. Given a new life. New names, new faces - whichever fits. Her paymasters call themselves The Twelve. But she knows nothing of them. Konstantin is the man who saved her and the one she answers to. She is Villanelle. Without conscience. Without guilt. Without weakness. Eve Polastri is the woman who hunts her. MI5, until one error of judgment costs her everything. Then stopping a ruthless assassin becomes more than her job. It becomes personal. ©2018 Luke Jennings (P)2018 W. F. Howes Ltd.";

const aboutContent = "Codename Villanelle is a 2018 thriller novel by British author Luke Jennings. A compilation of four serial e-book novellas published in 2014–2016, Codename Villanelle is the basis of BBC America's television series Killing Eve which debuted in April 2018. Villanelle is a Russian orphan who, after murdering the killers of her gangster father, is rescued from prison and trained as a hitwoman by a shadowy group called The Twelve. Codename Villanelle has been summarized as pitting \"heartless female assassin\" Villanelle against \"dowdy but dogged MI5 agent\" Eve Polastri, the two women \"battling it out at a distance\" as Polastri seeks clues at a series of killing sites.";
const contactContent = "Author	Luke Jennings. Language	English. Genre	Fiction, thriller, suspense. Publisher	Mulholland Books, an imprint of Little, Brown and Company. Publication date	3 April 2018. Media type	Hardcover, Kindle, audiobook. Pages	224. ISBN	978-0-316-51252-7. Followed by	Killing Eve: No Tomorrow. Website	http://www.lukejennings.com.";


const app = express();

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});

const blogSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Blog=mongoose.model("Blog",blogSchema);

const blog1=new Blog({
  title: "Day 1",
  content: "The Palazzo Falconieri stands on a promontory on one of the smaller Italian lakes. It’s late June, and a faint breeze touches the pines and cypresses that cluster like sentinels around the rocky headland. The gardens are imposing, and perhaps even beautiful, but the deep shadows lend the place a forbidding air, which is echoed by the severe lines of the Palazzo itself."
});

const blog2=new Blog({
  title:"Day 2",
  content: "The building faces the lake, and is fronted by tall windows through which silk curtains are visible. The east wing was once a banqueting hall, but now functions as a conference room. At its centre, beneath a heavy art deco chandelier, is a long table bearing a Bugatti bronze of a panther."
});

const defaultBlogs=[blog1, blog2];

app.use(bodyParser.urlencoded({
  extends: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Blog.find({},function(err,foundBlogs){
    if (foundBlogs.length===0){
      Blog.insertMany(defaultBlogs,function(err){
        if (err){
          console.log(err);
        }else{
          console.log("successfully insert");
        }
        res.redirect("/");
      })
    }else{
      res.render("home", {
        homeText: homeStartingContent,
        getPost: foundBlogs
      });
    }
  })


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
  const newPost= new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save();
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res) {
  const postId=req.params.postName;
  Blog.findOne({_id:postId},function(err,foundBlog){
    if (!err){
      if (!foundBlog){
        console.log("not exist");
      }
      else{
        res.render("post",{title:foundBlog.title, content: foundBlog.content})
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
