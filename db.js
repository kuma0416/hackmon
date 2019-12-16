var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://kuma0416:plmil456@myfirstcluster-nufiw.mongodb.net/test?retryWrites=true&w=majority";

exports.getBlood = function getBlood(callback){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        db.collection('blood', function(err, collection){
            collection.find().toArray(function (err, bloods){
                if(err) throw err;
                callback(bloods);
            });
        });
    });
}

exports.editBlood = function editBlood(account, number, callback){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        if(err) throw err;
        db.collection('blood', function(err, collection){
            collection.findOne({name: account})
                .then(function(data){
                    var name = data.name;
                    var blood = data.blood;
                    var count = data.count;
                    updateblood(name, blood, count, number);
                    callback("success");
                })
        })
    })
}

function updateblood(account, prev, count, number){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        if(err) throw err;
        db.collection('blood', function(err, collection){
            var now = prev - number;
            if(now <= 0){
                count ++;
                var newbl = 20 + count*5;
                collection.update({name:account},{$set:{blood:newbl,count:count}});
            } else {
                collection.update({name:account},{$set:{blood:now}});
            }
        })
    })
}


exports.getTeam = function getTeam(callback){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        db.collection('team', function(err, collection){
            collection.find().toArray(function (err, teams){
                if(err) throw err;
                callback(teams);
            });
        });
    });
}

exports.editScore = function editScore(team, plus, callback){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        if(err) throw err;
        db.collection('team', function(err, collection){
            collection.findOne({team: team})
                .then(function(data){
                    var team = data.team;
                    var score = data.score;
                    updateScore(team, score, plus);
                    callback("success");
                })
        })
    })
}

function updateScore(team, score, plus){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        if(err) throw err;
        db.collection('team', function(err, collection){
            var newscore = 0;
            var number = parseInt(plus, 10);
            newscore = score + number;
            collection.update({team:team},{$set:{score:newscore}});
        })
    })
}

exports.loginCheck = function loginCheck(account, password, callback){
    MongoClient.connect(uri, function(err, client){
        var db = client.db('MHlogin');
        if(err) throw err;
        db.collection('user', function(err, collection){
            collection.findOne({account: account})
                .then(function(check){
                    if(check == null){
                        callback("fail");
                    } else if(account === check.account && password === check.password){
                        callback("success");
                    }
                });
        });
    });
}