var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cheerio = require('cheerio'); 

var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

router.get('/', function (req, res){
  res.redirect('/scrape');

});

router.get('/articles', function (req, res){
  Article.find().sort({_id: -1})
    .populate('notes')

    .exec(function(err, doc){
      if (err){
        console.log(err);
      } 
      else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
      }
    });

});


router.get('/scrape', function(req, res) {

  request('https://www.yahoo.com/news/', function(error, response, html) {

    var $ = cheerio.load(html);

    var titlesArray = [];

    //Code needs to be written here to scrape

    res.redirect("/articles");

  });

});

router.post('/add/note/:id', function (req, res){

  var articleId = req.params.id;
  
  var noteAuthor = req.body.name;

  var noteContent = req.body.comment;

  var result = {
    author: noteAuthor,
    content: noteContent
  };

  var entry = new Note (result);

  entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    } 
    else {
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'notes':doc._id}}, {new: true})
      .exec(function(err, doc){
        if (err){
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });

});




router.post('/remove/note/:id', function (req, res){

  var noteId = req.params.id;

  Note.findByIdAndRemove(commentId, function (err, todo) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      res.sendStatus(200);
    }

  });

});


module.exports = router;