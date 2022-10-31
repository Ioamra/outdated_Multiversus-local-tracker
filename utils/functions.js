const fs = require('fs');
const { Client } = require('multiversus.js');
const userInfo = require('../userInfo.js');
const username = userInfo.username;
const password = userInfo.password;

const connectApi = async () => {
    return new Promise((resolve, reject) => {
        const client = new Client();
        let date = new Date();
        fs.readFile('token.txt', 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                reject(new Error());
            }
            if (data) {
                let lines = data.split("\n");
                let dateToken = new Date(lines[0]);
                let token = lines[1];
                const diffInTime = date.getTime() - dateToken.getTime();
                if (Math.floor(diffInTime / 3600000) > 22) {
                    await client.login(username, password);
                    fs.writeFile('token.txt', date+'\n'+client.accessToken, err => {
                        if (err) {
                            console.log(err);
                            reject(new Error());
                        }
                    });
                    resolve(client.accessToken);
                } else {
                    resolve(token);
                }
            } else {
                await client.login(username, password);
                fs.writeFile('token.txt', date+'\n'+client.accessToken, err => {
                    if (err) {
                        console.log(err);
                        reject(new Error());
                    }
                });
                resolve(client.accessToken);
            }
        });
    });
}

function deepFind(obj, path) {
    var paths = path.split('.')
      , current = obj
      , i;
  
    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
}

function toZeroIfNotExist (num) {
    if (num == undefined) {
        return 0;
    } else {
        return num
    }
}

function getDuration(start, end) {
    const oneSecond = 1000;
    const oneMinute = 1000 * 60;
    const diffInTime = end.getTime() - start.getTime();
    let m = Math.floor(diffInTime / oneMinute);
    let s = Math.round((diffInTime % oneMinute) / oneSecond);
    if (String(s).length == 2) {
        return m + "m " + s + "s";
    } else {
        return m + "m 0" + s + "s";
    }
}

function getAllCharacters() {
    let data = [
        {'fullName':'character_arya', 'name':'arya'},
        {'fullName':'character_batman', 'name':'batman'},
        {'fullName':'character_C021', 'name':'black_adam'},
        {'fullName':'character_bugs_bunny', 'name':'bugs_bunny'},
        {'fullName':'character_finn', 'name':'finn'},
        {'fullName':'character_garnet', 'name':'garnet'},
        {'fullName':'character_C023A', 'name':'gizmo'},
        {'fullName':'character_harleyquinn', 'name':'harleyquinn'},
        {'fullName':'character_jake', 'name':'jake'},
        {'fullName':'character_c16', 'name':'lebron_james'},
        {'fullName':'character_c019', 'name':'morty'},
        {'fullName':'character_creature', 'name':'reindog'},
        {'fullName':'character_C020', 'name':'rick'},
        {'fullName':'character_shaggy', 'name':'shaggy'},
        {'fullName':'character_steven', 'name':'steven'},
        {'fullName':'character_C023B', 'name':'stripe'},
        {'fullName':'character_superman', 'name':'superman'},
        {'fullName':'character_taz', 'name':'taz'},
        {'fullName':'character_C017', 'name':'the_iron_giant'},
        {'fullName':'character_tom_and_jerry', 'name':'tom_and_jerry'},
        {'fullName':'character_velma', 'name':'velma'},
        {'fullName':'character_wonder_woman', 'name':'wonder_woman'}
    ];
    for (let i = 0; i < data.length; i++) {
        if (i < 3) {
            if (i == 0) {
                data[i].color = 'hsl(0, 0%, 20%)';
            }
            if (i == 1) {
                data[i].color = 'hsl(0, 0%, 55%)';
            }
            if (i == 2) {
                data[i].color = 'hsl(0, 0%, 70%)';
            }
        } else {
            if (i % 3 == 0) {
                data[i].color = 'hsl(' + 360 / (data.length-3) * (i-3) + ', 100%, 30%)';
            } else if (i % 3 == 1) {
                data[i].color = 'hsl(' + 360 / (data.length-3) * (i-4) + ', 100%, 55%)';
            } else if (i % 3 == 2) {
                data[i].color = 'hsl(' + 360 / (data.length-3) * (i-5) + ', 100%, 70%)';
            }
        }
    }
    return data;
}

function nameCharacter(name) {
    if (name == 'c16') {
        name = 'lebron_james';
    } else if (name == 'C017') {
        name = 'the_iron_giant';
    } else if (name == 'c019') {
        name = 'morty';
    } else if (name == 'creature') {
        name = 'reindog';
    } else if (name == 'C023A') {
        name = 'gizmo';
    } else if (name == 'C020') {
        name = 'rick';
    } else if (name == 'C023B') {
        name = 'stripe';
    } else if (name == 'C021') {
        name = 'black_adam';
    }
    return name;
}

function nameMap(name) {
    if (name == '/Game/Panda_Main/Maps/ScoobyMansion/Map_ScoobyDoo.Map_ScoobyDoo') {
        name = 'scooby';
    } else if (name == '/Game/Panda_Main/Maps/M011/Maps/Small/Map_M011_Small.Map_M011_Small' || name == '/Game/Panda_Main/Maps/M011/Map_M011.Map_M011') {
        name = 'skyArenaPlatforms';
    } else if (name == '/Game/Panda_Main/Maps/M009/Map_M009_small.Map_M009_small' || name == '/Game/Panda_Main/Maps/M009/Map_M009.Map_M009') {
        name = 'cromulons';
    } else if (name == '/Game/Panda_Main/Maps/TrophyRoom/Map_TrophyRoom_LargePlatform.Map_TrophyRoom_LargePlatform') {
        name = 'trophyEdge';
    } else if (name == '/Game/Panda_Main/Maps/TrophyRoom/Map_TrophyRoom_2platforms.Map_TrophyRoom_2platforms') {
        name = 'trophyEdge2';
    } else if (name == '/Game/Panda_Main/Maps/M011/Maps/SmallNoPlat/Map_M011_SmallNoPlat.Map_M011_SmallNoPlat' || name == '/Game/Panda_Main/Maps/M011/Maps/LargeNoPlat/Map_M011_LargeNoPlat.Map_M011_LargeNoPlat') {
        name = 'skyArena';
    } else if (name == '/Game/Panda_Main/Maps/Map_TreeHouseSmall/Map_TreeHouseSmall.Map_TreeHouseSmall' || name == '/Game/Panda_Main/Maps/Map_TreeHouse/Map_TreeHouse.Map_TreeHouse') {
        name = 'treeFort';
    } else if (name == '/Game/Panda_Main/Maps/Map_Batcave/Map_Batcave.Map_Batcave') {
        name = 'batcave';
    }
    return name;
}

module.exports = {connectApi, deepFind, toZeroIfNotExist, getDuration, getAllCharacters, nameCharacter, nameMap};