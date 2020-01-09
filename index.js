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
  db.getJson("guardian", function(guardian){
    db.getJson("team", function(team){
      res.render('index', {
        all: guardian,
        team: team
      })
    })
  })
})

app.get('/back', function(req, res){
  var account = req.session.account;
  db.getJson("guardian", function(guardian){
    db.getJson("team", function(team){
      res.render('back', {
        all: guardian,
        team: team,
        account:account
      })
    })
  })
})

app.get('/login', function(req, res){
  res.render('login', {
    loginSuccess:"notYet"
  });
})

app.post('/login', function(req, res){
  var account = req.body.account;
  var password = req.body.password;
  db.loginCheck(function(user){
    for(var i=0;i<user.length;i++){
      if(account === user[i].account && password === user[i].password){
        req.session.account = account;
        db.getJson("guardian", function(guardian){
          db.getJson("team", function(team){
            res.render('back', {
              all: guardian,
              team: team,
              account: account
            })
          })
        })
      }
    }
    if(req.session.account == null){
      res.render('login', {
        loginSuccess: "fail"
      })
    }
  })
})

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/back');
});

app.get('/back/edit', function(req, res){
  res.render('edit');
});

app.post('/edit', function(req, res){
  var G1data = {name:req.body.guardian1, HP:req.body.HP1};
  var G2data = {name:req.body.guardian2, HP:req.body.HP2};
  var T1data = {number:req.body.teamnum1,score:req.body.score1};
  var T2data = {number:req.body.teamnum2,score:req.body.score2};
  db.editGuardian(req.session.account, G1data, G2data, function(result){});
  db.editTeam(req.session.account, T1data, T2data, function(result){});
  res.redirect('/back');
});

app.get('/log', function(req, res){
  db.getJson("log", function(log){
    var logParse = "";
    for(var i=0;i<log.length;i++){
      if(log[i].goal == "guardian"){
        logParse += "使用者 " + log[i].account + " 對 " + log[i].goal + " " + log[i].no + "扣除" + log[i].HP + "點傷害\n";
      } else if(log[i].goal == "team"){
        logParse += "使用者 " + log[i].account + " 對 " + log[i].goal + " " + log[i].no + "增加" + log[i].score + "點分數\n";
      }
    }
    res.render('log', {
      log: logParse
    });
  });
});

app.listen(port, function(){
  console.log("server running!");
});
/*  app.get('/', function(req, res){
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
  })*/