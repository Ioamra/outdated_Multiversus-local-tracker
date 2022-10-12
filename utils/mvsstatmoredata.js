const { connectApi, deepFind, toZeroIfNotExist, getAllCharacters, getDuration, nameCharacter, nameMap } = require("./functions");
const { Client } = require('multiversus.js');
const fs = require('fs');

const dataCharactersPopularity = async () => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    var obj = {};
    var allCharacters = getAllCharacters();
    const rankGlobal1v1 = await client.leaderboards.fetch('1v1');
    const rankGlobal2v2 = await client.leaderboards.fetch('2v2');
    for (let i = 0; i < allCharacters.length; i++) {
        const rankGlobalCharacter1v1 = await client.leaderboards.fetchCharacter('1v1', allCharacters[i].fullName);
        const rankGlobalCharacter2v2 = await client.leaderboards.fetchCharacter('2v2', allCharacters[i].fullName);
        allCharacters[i].totalPlayer1v1 = rankGlobalCharacter1v1.total_leaders;
        allCharacters[i].totalPlayer2v2 = rankGlobalCharacter2v2.total_leaders;
        allCharacters[i].globalTotalPlayers1v1 = rankGlobal1v1.total_leaders;
        allCharacters[i].globalTotalPlayers2v2 = rankGlobal2v2.total_leaders;
    }
    obj.charactersList = allCharacters;
    return obj;
}

const saveDataMmrByRank = async () => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    console.log('saveDataMmrByRank start !');
    var obj = {};
    var allCharacters = getAllCharacters();
    return new Promise((resolve, reject) => {
        fs.readFile('moredata.txt', 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                reject(new Error());
            }
            if (data) {
                if (JSON.parse(data).charactersList) {
                    obj = JSON.parse(data);
                    let pageLoad = 0;
                    for (let val in obj.charactersList[0].leaderboard1v1) {
                        pageLoad += 1;
                    }
                    pageLoad = pageLoad / 25;
                    for (let i = 0; i < allCharacters.length; i++) {
                        //* Nombre de x25 data
                        for (let j = 1; j < 11; j++) {
                            const tmpRankGlobalCharacter1v1 = await client.leaderboards.fetchCharacter('1v1', allCharacters[i].fullName, pageLoad+j);
                            const tmpRankGlobalCharacter2v2 = await client.leaderboards.fetchCharacter('2v2', allCharacters[i].fullName, pageLoad+j);
                            for (let k = 0; k < 25; k++) {
                                obj.charactersList[i].leaderboard1v1[(25*j)-k+(pageLoad*25)] = Math.round(tmpRankGlobalCharacter1v1.leaders[24-k].score);
                                obj.charactersList[i].leaderboard2v2[(25*j)-k+(pageLoad*25)] = Math.round(tmpRankGlobalCharacter2v2.leaders[24-k].score);
                            }
                        }
                    }
                    fs.writeFile('moredata.txt', JSON.stringify(obj), err => {
                        if (err) {
                            console.log(err);
                            reject(new Error());
                        }
                        console.log('saveDataMmrByRank complete !');
                        resolve({"dataLoaded": pageLoad * 25});
                    });
                } else {
                    obj = JSON.parse(data);
                    for (let i = 0; i < allCharacters.length; i++) {
                        let objTmp1v1 = {};
                        let objTmp2v2 = {};
                        //* Nombre de x25 data
                        for (let j = 1; j < 11; j++) {
                            const tmpRankGlobalCharacter1v1 = await client.leaderboards.fetchCharacter('1v1', allCharacters[i].fullName, j);
                            const tmpRankGlobalCharacter2v2 = await client.leaderboards.fetchCharacter('2v2', allCharacters[i].fullName, j);
                            for (let k = 0; k < 25; k++) {
                                objTmp1v1[(25*j)-k] = Math.round(tmpRankGlobalCharacter1v1.leaders[24-k].score);
                                objTmp2v2[(25*j)-k] = Math.round(tmpRankGlobalCharacter2v2.leaders[24-k].score);
                            }
                            allCharacters[i].leaderboard1v1 = objTmp1v1;
                            allCharacters[i].leaderboard2v2 = objTmp2v2;
                        }
                    }
                    obj.charactersList = allCharacters;
                    fs.writeFile('moredata.txt', JSON.stringify(obj), err => {
                        if (err) {
                            console.log(err);
                            reject(new Error());
                        }
                        console.log('saveDataMmrByRank complete !');
                        resolve({"dataLoaded": 250});
                    });
                }
            } else {
                for (let i = 0; i < allCharacters.length; i++) {
                    let objTmp1v1 = {};
                    let objTmp2v2 = {};
                    //* Nombre de x25 data
                    for (let j = 1; j < 11; j++) {
                        const tmpRankGlobalCharacter1v1 = await client.leaderboards.fetchCharacter('1v1', allCharacters[i].fullName, j);
                        const tmpRankGlobalCharacter2v2 = await client.leaderboards.fetchCharacter('2v2', allCharacters[i].fullName, j);
                        for (let k = 0; k < 25; k++) {
                            objTmp1v1[(25*j)-k] = Math.round(tmpRankGlobalCharacter1v1.leaders[24-k].score);
                            objTmp2v2[(25*j)-k] = Math.round(tmpRankGlobalCharacter2v2.leaders[24-k].score);
                        }
                        allCharacters[i].leaderboard1v1 = objTmp1v1;
                        allCharacters[i].leaderboard2v2 = objTmp2v2;
                    }
                }
                obj.charactersList = allCharacters;
                fs.writeFile('moredata.txt', JSON.stringify(obj), err => {
                    if (err) {
                        console.log(err);
                        reject(new Error());
                    }
                    console.log('saveDataMmrByRank complete !');
                    resolve({"dataLoaded": 250});
                });
            }
        });
    });
}

const getMmrTop = async (numTop) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const leaderboardData1v1 = await client.leaderboards.fetch('1v1', (numTop/25));
    const leaderboardData2v2 = await client.leaderboards.fetch('2v2', (numTop/25));
    let mmr1v1 = Math.round(leaderboardData1v1.leaders[24].score);
    let mmr2v2 = Math.round(leaderboardData2v2.leaders[24].score);
    let obj = {};
    obj.mmr1v1 = mmr1v1;
    obj.mmr2v2 = mmr2v2;
    return obj;
}

const resetSave = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('moredata.txt', 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                reject(new Error());
            }
            fs.writeFile('moredata.txt', "", err => {
                if (err) {
                    console.log(err);
                    reject(new Error());
                }
                console.log("Datas deleted");
                resolve({"res": "Datas deleted"});
            });
        });
    });
}

const loadSave = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('moredata.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(new Error());
            }
            if (data) {
                data = JSON.parse(data)
                let obj = {};
                if (data.leaderboard1v1) {
                    obj.leaderboard1v1 = data.leaderboard1v1;
                    obj.leaderboard2v2 = data.leaderboard2v2;
                }
                if (data.charactersList) {
                    obj.charactersList = data.charactersList;
                }
                resolve(obj);
            } else {
                let obj = {};
                obj.noData = true;
                resolve(obj);
            }
        });
    });
}

module.exports = { dataCharactersPopularity, saveDataMmrByRank, getMmrTop, resetSave, loadSave };