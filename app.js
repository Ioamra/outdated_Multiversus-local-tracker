const path = require("path");
const express = require("express");
const { searchAccount } = require("./utils/mvsstatsearch");
const { dataAccount } = require("./utils/mvsstataccount");
const { dataMatchs, dataMoreMatchs } = require("./utils/mvsstatmatchs");
const { dataLeaderboard, dataLeaderboardCharacter } = require("./utils/mvsstatleaderboard");
const { dataCharactersPopularity, saveDataMmrByRank, getMmrTop, resetSave, loadSave, saveAll1v1, loadSaveAll1v1, resetSaveAll1v1, saveAll2v2, loadSaveAll2v2, resetSaveAll2v2 } = require("./utils/mvsstatmoredata");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));  


app.get('/mvsstatmoredata', (req, res) => {
    if (req.query.method == 'dataCharactersPopularity') {
        dataCharactersPopularity().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'saveDataMmrByRank') {
        saveDataMmrByRank().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'resetSave') {
        resetSave().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'loadSave') {
        loadSave().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'getMmrTop' && req.query.numTop) {
        getMmrTop(req.query.numTop).then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'saveAll1v1') {
        saveAll1v1().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'loadSaveAll1v1') {
        loadSaveAll1v1().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'resetSaveAll1v1') {
        resetSaveAll1v1().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'saveAll2v2') {
        saveAll2v2().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'loadSaveAll2v2') {
        loadSaveAll2v2().then(data => {
            res.send(data);
        });
    } else if (req.query.method == 'resetSaveAll2v2') {
        resetSaveAll2v2().then(data => {
            res.send(data);
        });
    }
});

app.get('/mvsstatsearch', (req, res) => {
    searchAccount(req.query.name).then(data => {
        res.send(data);
    });
});

app.get('/mvsstataccount', (req, res) => {
    dataAccount(req.query.name).then(infoAccount => {
        res.send(infoAccount);
    });
});

app.get('/mvsstatmatchs', (req, res) => {
    if ('page' in req.query) {
        dataMoreMatchs(req.query.name, req.query.page).then(infoMatchs => {
            res.send(infoMatchs);
        });
    } else {
        dataMatchs(req.query.name).then(infoMatchs => {
            res.send(infoMatchs);
        });
    }
});

app.get('/mvsstatleaderboard', (req, res) => {
    if ('character' in req.query) {
        if ('page' in req.query) {
            dataLeaderboardCharacter(req.query.character, req.query.page).then(data => {
                res.send(data);
            });
        } else {
            dataLeaderboardCharacter(req.query.character).then(data => {
                res.send(data);
            });
        }
    } else {
        if ('page' in req.query) {
            dataLeaderboard(req.query.page).then(data => {
                res.send(data);
            });
        } else {
            dataLeaderboard().then(data => {
                res.send(data);
            });
        }
    }
});

app.listen(port, () => {

});