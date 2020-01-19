var fs = require('fs');
var user = 'user.json';
var team = 'team.json';
var guardian = 'guardian.json';

var db = {
    loginCheck: function(callback){
        fs.readFile(user, 'utf-8', function(err, userlist){
            if (err){
                callback(err);
            } else {
                callback(JSON.parse(userlist));
            }
        });
    },

    getJson: function(filename, callback){
        var file = filename + ".json";
        fs.readFile(file, 'utf-8', function(err, data){
            if(err){
                callback(err);
            } else {
                callback(JSON.parse(data));
            }
        });
    },

    save: function(data, filename, callback){
        var file = filename + ".json"
        fs.writeFile(file, JSON.stringify(data), callback);
    },

    editGuardian: function(account, G1data, G2data, callback){
        db.getJson("guardian", function(Glist){
            var nowHP = 0;
            var Ge= 0;
            for(var i = 0;i < Glist.length; i++){
                if(Glist[i].no == G1data.name){
                    nowHP = Glist[i].HP - G1data.HP;
                    Ge++;
                    if(nowHP <= 0){
                        Glist[i].count ++;
                        Glist[i].HP = 20 + Glist[i].count*5;
                    } else {
                        Glist[i].HP = nowHP;
                    }
                } else if (Glist[i].no == G2data.name){
                    nowHP = Glist[i].HP - G2data.HP;
                    Ge++;
                    if(nowHP <= 0){
                        Glist[i].count ++;
                        Glist[i].HP = 20 + Glist[i].count*5;
                    } else {
                        Glist[i].HP = nowHP;
                    }
                }
            }
            if(Ge == 1){
                var nowdate = new Date();
                db.addlog({"time": nowdate.toLocaleString(), "account": account, "goal":"guardian", "no": G1data.name, "HP":G1data.HP}, {}, callback);
            } else if(Ge == 2) {
                var nowdate = new Date();
                db.addlog({"time": nowdate.toLocaleString(), "account": account, "goal":"guardian", "no": G1data.name, "HP":G1data.HP}, {"time": nowdate.toLocaleString(), "account": account, "goal":"guardian", "no": G2data.name, "HP":G2data.HP}, callback);
            }
            db.save(Glist, "guardian", callback);
        });
    },

    editTeam: function(account, T1data, T2data, callback){
        db.getJson("team", function(Tlist){
            var nowScore = 0;
            var Te = 0;
            for(var i = 0;i < Tlist.length; i++){
                if(Tlist[i].number == T1data.number){
                    Te++;
                    nowScore = Tlist[i].score + parseInt(T1data.score);
                    Tlist[i].score = nowScore;
                } else if (Tlist[i].number == T2data.number){
                    Te++;
                    nowScore = Tlist[i].score + parseInt(T2data.score, 10);
                    Tlist[i].score = nowScore;
                }
            }
            if(Te == 1){
                var nowdate = new Date();
                db.addtlog({"time": nowdate.toLocaleString(), "account": account, "goal":"team", "no": T1data.number, "score":T1data.score}, {}, callback);
            } else if(Te == 2) {
                var nowdate = new Date();
                db.addtlog({"time": nowdate.toLocaleString(), "account": account, "goal":"team", "no": T1data.number, "score":T1data.score}, {"time": nowdate.toLocaleString(), "account": account, "goal":"team", "no": T2data.number, "score":T2data.score}, callback);
            }
            db.save(Tlist, "team", callback);
        })
    },

    recoverguardian: function(callback){
        db.getJson("guardian", function(guardian){
            for(var i=0;i<guardian.length;i++){
                guardian[i].HP = 20;
                guardian[i].count = 0;
            }
            db.save(guardian, "guardian", callback);
        })
    },

    recoverteam: function(callback){
        db.getJson("team", function(team){
            for(var i=0;i<team.length;i++){
                team[i].score = 0;
            }
            db.save(team, "team", callback);
        })
    },

    addlog: function(log1, log2, callback){
        db.getJson("log", function(logs){
            logs.push(log1);
            logs.push(log2);
            db.save(logs, "log", callback);
        });
    },

    addtlog: function(log1, log2, callback){
        db.getJson("logt", function(logs){
            logs.push(log1);
            logs.push(log2);
            db.save(logs, "logt", callback);
        });
    }
}

module.exports = db;