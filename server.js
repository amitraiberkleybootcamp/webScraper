var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var request = require('request'); 
var cheerio = require('cheerio');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static(process.cwd() + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/WebScraper');

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Comment = require('./models/Note.js');
var Article = require('./models/Article.js');


var router = require('./controllers/controller.js');
app.use('/', router);


var port = process.env.PORT || 3006;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});