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
      var account = req.session.account;
      var loginState = req.session.loginState;
      db.getBlood(function(all){
        db.getTeam(function(team){
          res.render('index', {
            all: all,
            account:"",
            wrong:"",
            team: team
          });
        });
      });
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
          req.session.loginState = "true";
          res.render('back', {
            account: req.session.account,
            state: ""
          })
        } else {
          db.getBlood(function(all){
            db.getTeam(function(team){
              res.render('index', {
                all: all,
                account:"",
                wrong:"",
                team: team
              });
            });
          });
        }
    })
  });

  app.get('/update/:account', function(req, res){
    if(req.session.account){
      var account = req.session.account;
      res.render('index_plus', {
        account: account
      });
    } else {
      db.getBlood(function(all){
        db.getTeam(function(team){
          res.render('index', {
            all: all,
            account:"",
            wrong:"wrongPath",
            team: team
          });
        });
      });
    }
  });

  app.post('/update/:account', function(req, res){
    var blood = req.body.blood;
    var account = req.session.account;
    db.editBlood(account, blood, function(state){
        console.log(state);
        db.getBlood(function(all){
          res.render('back', {
            account:account,
            state: state
          })
        })
    });
  });

  app.get('/nowblood', function(req, res){
    db.getBlood(function(all){
      db.getTeam(function(team){
        res.render('index', {
          all: all,
          account:"",
          wrong:"",
          team: team
        });
      });
    });
  })

  app.get('/team', function(req, res){
    res.render('team');
  })

  app.post('/team', function(req, res){
    var plusScore = req.body.score;
    var teamNo = req.body.teamnum;
    db.editScore(teamNo, plusScore, function(state){
      res.render('back', {
        account: req.session.account,
        state: state
      })
    })
  })

  app.listen(port, function(){
      console.log("server running!");
  });