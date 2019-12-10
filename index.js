var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = process.env.PORT || 3000;
var session = require('express-session');
var fs = require('fs');
var db = require('./db');

function render(filename, params) {
    var data = fs.readFileSync(filename, 'utf8');
    for (var key in params) {
      data = data.replace('{' + key + '}', params[key]);
    }
  return data;
  }

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  
  app.set('view engine', 'ejs');
  
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    account: ""
  }));

  app.get('/', function(req, res){
      var username = req.session.username;
      var loginState = req.session.loginState;
      var A, B, C, D, Abl, Bbl, Cbl, Dbl;
      db.getBlood(function(all){
          res.render('index', {
              all: all
          })
      });
      //res.render('index')
  });

  app.get('/login', function(req, res){
    res.render('login');
  });

  app.post('/login', function(req, res){
    var account = req.body.account;
    var password = req.body.password;
    db.loginCheck(account, password, function(login){
        if(login == "success"){
            req.session.account = account;
            res.render('index_plus', {
                account: account,
            })
        } else {
            res.render('index')
        }
    })
  });

  app.post('/update/:account', function(req, res){
    var blood = req.body.blood;
    var account = req.session.account;
    db.editBlood(account, blood, function(state){
        console.log(state);
        res.redirect('/');
    });
  });

  app.listen(port, function(){
      console.log("server running!");
  });