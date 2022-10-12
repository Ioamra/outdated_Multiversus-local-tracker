const { connectApi, deepFind, getDuration, nameCharacter, nameMap } = require("./functions");
const { Client } = require('multiversus.js');

const dataMatchs = async (name) => {  
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const searchData = await client.profiles.search(name);
    var idProfil;
    let idProfilTmp, accountsDataTmp;
    idProfil = searchData.results[0].result.account_id;
    
    for (let i = 0; i < searchData.results.length; i++) {
        idProfilTmp = searchData.results[i].result.account_id;
        accountsDataTmp = await client.accounts.fetch(idProfilTmp);
        if (accountsDataTmp.identity.alternate.wb_network[0].username == name) {
            idProfil = searchData.results[i].result.account_id;
        }
    }
    const matchesData = await client.matches.fetchAll(idProfil, 1);
    var matches = {};
    var myId, allyId, enemyId, enemyId2, allyTeamId, enemyTeamId;
    var first = true;
    var allyAccountId, enemyAccountId, enemyAccountId2;
    for (let i = 0; i < (matchesData.matches).length; i++) {
        const gameData = await client.matches.fetch(matchesData.matches[i].id);


        if (gameData.completion_time != null && gameData.server_data.PlayerData != undefined) {
            let objTmp = {};
            let me = {};
            let ally = {};
            let enemy = {};
            let enemy2 = {};
            objTmp.mode = gameData.template.data.mode;
            objTmp.mode = gameData.template.data.mode;

            let yearCreatedAt = Number((gameData.created_at).slice(0,4));
            let monthCreatedAt = Number((gameData.created_at).slice(5,7));
            let dayCreatedAt = Number((gameData.created_at).slice(8,10));
            let hoursCreatedAt = Number((gameData.created_at).slice(11,13));
            let minutesCreatedAt = Number((gameData.created_at).slice(14,16));
            let secondesCreatedAt = Number((gameData.created_at).slice(17,19));
            let dateCreatedAt = new Date(yearCreatedAt, monthCreatedAt, dayCreatedAt, hoursCreatedAt, minutesCreatedAt, secondesCreatedAt);

            let yearCompletionTime = Number((gameData.completion_time).slice(0,4));
            let monthCompletionTime = Number((gameData.completion_time).slice(5,7));
            let dayCompletionTime = Number((gameData.completion_time).slice(8,10));
            let hoursCompletionTime = Number((gameData.completion_time).slice(11,13));
            let minutesCompletionTime = Number((gameData.completion_time).slice(14,16));
            let secondesCompletionTime = Number((gameData.completion_time).slice(17,19));
            let dateCompletionTime = new Date(yearCompletionTime, monthCompletionTime, dayCompletionTime, hoursCompletionTime, minutesCompletionTime, secondesCompletionTime);
            
            objTmp.duration = getDuration(dateCreatedAt, dateCompletionTime);
            objTmp.created_at = gameData.created_at;
            objTmp.completion_time = gameData.completion_time;

            objTmp.mapName = nameMap(gameData.server_data.MapName);
                     
            if (gameData.template.data.mode == "1v1") {
                if (gameData.win[0] == idProfil) {
                    objTmp.result = 'win';
                } else {
                    objTmp.result = 'lose';
                }
                if (gameData.server_data.PlayerData[0].AccountId == idProfil) {
                    myId = 0;
                    enemyId = 1;
                    enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                } else if (gameData.server_data.PlayerData[1].AccountId == idProfil) {
                    myId = 1;
                    enemyId = 0;
                    enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                }
                me.username = gameData.server_data.PlayerData[myId].Username;
                me.accountId = gameData.server_data.PlayerData[myId].AccountId;
                me.character = nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999));
                me.damageDone = gameData.server_data.PlayerData[myId].DamageDone;
                me.ringOuts = gameData.server_data.PlayerData[myId].Ringouts;
                me.deaths = gameData.server_data.PlayerData[myId].Deaths;
                me.teamId = gameData.server_data.PlayerData[myId].TeamIndex;
                me.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[myId].TeamIndex];
                
                enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];

                if (gameData.data.ratingUpdates) {
                    for (let j = 0; j < (gameData.data.ratingUpdates.playerRatingChanges).length; j++) {
                        if (idProfil == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                            me.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                            me.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                        }
                        if (enemyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                            enemy.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                            enemy.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                        }
                    }
                }

                if (first) {
                    const myProfiles = await client.profiles.fetch(gameData.server_data.PlayerData[myId].AccountId);
                    var allCharactersPlayedMe = myProfiles.server_data.stat_trackers.character_wins;
                    first = false;
                    let objTmpMe = {};
                    let objTmpEnemy = {};
                    for (let key in allCharactersPlayedMe) {
                        if (deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999))) {
                            objTmpMe.perks1 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                            objTmpMe.perks2 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                            objTmpMe.perks3 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                            objTmpMe.perks4 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                            me.perks = objTmpMe;
                        }
                    }
                    if (gameData.server_data.PlayerData[enemyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                        const enemyProfiles = await client.profiles.fetch(gameData.server_data.PlayerData[enemyId].AccountId);
                        var allCharactersPlayedEnemy = enemyProfiles.server_data.stat_trackers.character_wins;
                        for (let key in allCharactersPlayedEnemy) {
                            if (deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999))) {
                                objTmpEnemy.perks1 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                                objTmpEnemy.perks2 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                                objTmpEnemy.perks3 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                                objTmpEnemy.perks4 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                                enemy.perks = objTmpEnemy;
                            }
                        }
                    } else { enemy.username = "BOT"; }
                }
                objTmp.me = me;
                objTmp.enemy = enemy;

            } else if (gameData.template.data.mode == "2v2") {
                if (gameData.server_data.PlayerData[3]) {
                    if (gameData.win[0] == idProfil || gameData.win[1] == idProfil) {
                        objTmp.result = 'win';
                    } else {
                        objTmp.result = 'lose';
                    }
                    if (gameData.server_data.PlayerData[0].AccountId == idProfil) {
                        myId = 0;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;

                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            enemyId = 2;
                            enemyAccountId = gameData.server_data.PlayerData[2].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[1].AccountId == idProfil) {
                        myId = 1;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            enemyId = 2;
                            enemyAccountId = gameData.server_data.PlayerData[2].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[2].AccountId == idProfil) {
                        myId = 2;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                                enemyId2 = 1;
                                enemyAccountId2 = gameData.server_data.PlayerData[1].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[3].AccountId == idProfil) {
                        myId = 3;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                                enemyId2 = 1;
                                enemyAccountId2 = gameData.server_data.PlayerData[1].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                        }
                    }
                    let yearCreatedAt = Number((gameData.created_at).slice(0,4));
                    let monthCreatedAt = Number((gameData.created_at).slice(5,7));
                    let dayCreatedAt = Number((gameData.created_at).slice(8,10));
                    let hoursCreatedAt = Number((gameData.created_at).slice(11,13));
                    let minutesCreatedAt = Number((gameData.created_at).slice(14,16));
                    let dateCreatedAt = new Date(yearCreatedAt, monthCreatedAt, dayCreatedAt, hoursCreatedAt, minutesCreatedAt);

                    let yearCompletionTime = Number((gameData.completion_time).slice(0,4));
                    let monthCompletionTime = Number((gameData.completion_time).slice(5,7));
                    let dayCompletionTime = Number((gameData.completion_time).slice(8,10));
                    let hoursCompletionTime = Number((gameData.completion_time).slice(11,13));
                    let minutesCompletionTime = Number((gameData.completion_time).slice(14,16));
                    let dateCompletionTime = new Date(yearCompletionTime, monthCompletionTime, dayCompletionTime, hoursCompletionTime, minutesCompletionTime);
                    
                    objTmp.duration = getDuration(dateCreatedAt, dateCompletionTime);
                    
                    me.character = nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999));    
                    me.username = gameData.server_data.PlayerData[myId].Username;
                    me.accountId = gameData.server_data.PlayerData[myId].AccountId;
                    me.damageDone = gameData.server_data.PlayerData[myId].DamageDone;
                    me.ringOuts = gameData.server_data.PlayerData[myId].Ringouts;
                    me.deaths = gameData.server_data.PlayerData[myId].Deaths;
                    me.teamId = gameData.server_data.PlayerData[myId].TeamIndex;
                    me.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[myId].TeamIndex];
                    
                    ally.character = nameCharacter((gameData.server_data.PlayerData[allyId].CharacterSlug).slice(10,999));
                    ally.username = gameData.server_data.PlayerData[allyId].Username;
                    ally.accountId = gameData.server_data.PlayerData[allyId].AccountId;
                    ally.damageDone = gameData.server_data.PlayerData[allyId].DamageDone;
                    ally.ringOuts = gameData.server_data.PlayerData[allyId].Ringouts;
                    ally.deaths = gameData.server_data.PlayerData[allyId].Deaths;
                    ally.teamId = gameData.server_data.PlayerData[allyId].TeamIndex;
                    ally.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[allyId].TeamIndex];

                    enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                    enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                    enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                    enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                    enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                    enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                    enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                    enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];
                    
                    enemy2.character = nameCharacter((gameData.server_data.PlayerData[enemyId2].CharacterSlug).slice(10,999));
                    enemy2.username = gameData.server_data.PlayerData[enemyId2].Username;
                    enemy2.accountId = gameData.server_data.PlayerData[enemyId2].AccountId;
                    enemy2.damageDone = gameData.server_data.PlayerData[enemyId2].DamageDone;
                    enemy2.ringOuts = gameData.server_data.PlayerData[enemyId2].Ringouts;
                    enemy2.deaths = gameData.server_data.PlayerData[enemyId2].Deaths;
                    enemy2.teamId = gameData.server_data.PlayerData[enemyId2].TeamIndex;
                    enemy2.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId2].TeamIndex];

                    if (gameData.data.ratingUpdates) {
                        for (let j = 0; j < (gameData.data.ratingUpdates.playerRatingChanges).length; j++) {
                            if (idProfil == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                me.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                me.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (allyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                ally.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                ally.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (enemyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                enemy.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                enemy.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (enemyAccountId2 == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                enemy2.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                enemy2.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                        }
                    }
                    
                    if (first) {
                        const myProfiles = await client.profiles.fetch(gameData.server_data.PlayerData[myId].AccountId);
                        var allCharactersPlayedMe = myProfiles.server_data.stat_trackers.character_wins;
                        first = false;
                        let objTmpMe = {};
                        let objTmpAlly = {};
                        let objTmpEnemy = {};
                        let objTmpEnemy2 = {};
                        for (let key in allCharactersPlayedMe) {
                            if (deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999))) {
                                objTmpMe.perks1 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                                objTmpMe.perks2 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                                objTmpMe.perks3 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                                objTmpMe.perks4 = deepFind(myProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                                me.perks = objTmpMe;
                            }
                        }
                        if (gameData.server_data.PlayerData[allyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                            const allyProfiles = await client.profiles.fetch(gameData.server_data.PlayerData[allyId].AccountId);
                            var allCharactersPlayedAlly = allyProfiles.server_data.stat_trackers.character_wins;
                            for (let key in allCharactersPlayedAlly) {
                                if (deepFind(allyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[allyId].CharacterSlug).slice(10,999))) {
                                    objTmpAlly.perks1 = deepFind(allyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                                    objTmpAlly.perks2 = deepFind(allyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                                    objTmpAlly.perks3 = deepFind(allyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                                    objTmpAlly.perks4 = deepFind(allyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                                    ally.perks = objTmpAlly;
                                }
                            }
                        } else { ally.username = "BOT"; }
                        if (gameData.server_data.PlayerData[enemyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                            const enemyProfiles = await client.profiles.fetch(gameData.server_data.PlayerData[enemyId].AccountId);
                            var allCharactersPlayedEnemy = enemyProfiles.server_data.stat_trackers.character_wins;
                            for (let key in allCharactersPlayedEnemy) {
                                if (deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999))) {
                                    objTmpEnemy.perks1 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                                    objTmpEnemy.perks2 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                                    objTmpEnemy.perks3 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                                    objTmpEnemy.perks4 = deepFind(enemyProfiles, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                                    enemy.perks = objTmpEnemy;
                                }
                            }
                        } else { enemy.username = "BOT"; }
                        if (gameData.server_data.PlayerData[enemyId2].AccountId.slice(0,3).toLowerCase() != 'bot') {
                            const enemyProfiles2 = await client.profiles.fetch(gameData.server_data.PlayerData[enemyId2].AccountId);
                            var allCharactersPlayedEnemy2 = enemyProfiles2.server_data.stat_trackers.character_wins;
                            for (let key in allCharactersPlayedEnemy2) {
                                if (deepFind(enemyProfiles2, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined && nameCharacter(key.slice(10,999)) == nameCharacter((gameData.server_data.PlayerData[enemyId2].CharacterSlug).slice(10,999))) {
                                    objTmpEnemy2.perks1 = deepFind(enemyProfiles2, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
                                    objTmpEnemy2.perks2 = deepFind(enemyProfiles2, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
                                    objTmpEnemy2.perks3 = deepFind(enemyProfiles2, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
                                    objTmpEnemy2.perks4 = deepFind(enemyProfiles2, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
                                    enemy2.perks = objTmpEnemy2;
                                }
                            }
                        } else { enemy2.username = "BOT"; }
                    }
                    objTmp.me = me;
                    objTmp.ally = ally;
                    objTmp.enemy = enemy;
                    objTmp.enemy2 = enemy2;
                }
            }
            matches[i] = objTmp;
        }
    }
    var obj = {};
    obj.matches = matches;
    return obj;
};

const dataMoreMatchs = async (name, page) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const searchData = await client.profiles.search(name);
    const idProfil = searchData.results[0].result.account_id;
    const matchesData = await client.matches.fetchAll(idProfil, page);
    var matches = {};
    var myId, allyId, enemyId, enemyId2, allyTeamId, enemyTeamId;
    for (let i = 0; i < (matchesData.matches).length; i++) {
        const gameData = await client.matches.fetch(matchesData.matches[i].id);
        if (gameData.completion_time != null && gameData.server_data.PlayerData != undefined) {
            let objTmp = {};
            let me = {};
            let ally = {};
            let enemy = {};
            let enemy2 = {};
            objTmp.mode = gameData.template.data.mode;
            objTmp.mode = gameData.template.data.mode;

            let yearCreatedAt = Number((gameData.created_at).slice(0,4));
            let monthCreatedAt = Number((gameData.created_at).slice(5,7));
            let dayCreatedAt = Number((gameData.created_at).slice(8,10));
            let hoursCreatedAt = Number((gameData.created_at).slice(11,13));
            let minutesCreatedAt = Number((gameData.created_at).slice(14,16));
            let secondesCreatedAt = Number((gameData.created_at).slice(17,19));
            let dateCreatedAt = new Date(yearCreatedAt, monthCreatedAt, dayCreatedAt, hoursCreatedAt, minutesCreatedAt, secondesCreatedAt);

            let yearCompletionTime = Number((gameData.completion_time).slice(0,4));
            let monthCompletionTime = Number((gameData.completion_time).slice(5,7));
            let dayCompletionTime = Number((gameData.completion_time).slice(8,10));
            let hoursCompletionTime = Number((gameData.completion_time).slice(11,13));
            let minutesCompletionTime = Number((gameData.completion_time).slice(14,16));
            let secondesCompletionTime = Number((gameData.completion_time).slice(17,19));
            let dateCompletionTime = new Date(yearCompletionTime, monthCompletionTime, dayCompletionTime, hoursCompletionTime, minutesCompletionTime, secondesCompletionTime);
            
            objTmp.duration = getDuration(dateCreatedAt, dateCompletionTime);
            objTmp.created_at = gameData.created_at;
            objTmp.completion_time = gameData.completion_time;
            objTmp.mapName = nameMap(gameData.server_data.MapName);
            
            if (gameData.template.data.mode == "1v1") {
                if (gameData.win[0] == idProfil) {
                    objTmp.result = 'win';
                } else {
                    objTmp.result = 'lose';
                }
                if (gameData.server_data.PlayerData[0].AccountId == idProfil) {
                    myId = 0;
                    enemyId = 1;
                    enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                } else if (gameData.server_data.PlayerData[1].AccountId == idProfil) {
                    myId = 1;
                    enemyId = 0;
                    enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                }
                me.username = gameData.server_data.PlayerData[myId].Username;
                me.accountId = gameData.server_data.PlayerData[myId].AccountId;

                me.character = nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999));
                me.damageDone = gameData.server_data.PlayerData[myId].DamageDone;
                me.ringOuts = gameData.server_data.PlayerData[myId].Ringouts;
                me.deaths = gameData.server_data.PlayerData[myId].Deaths;
                me.teamId = gameData.server_data.PlayerData[myId].TeamIndex;
                me.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[myId].TeamIndex];
                
                enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];
                
                if (gameData.data.ratingUpdates) {
                    for (let j = 0; j < (gameData.data.ratingUpdates.playerRatingChanges).length; j++) {
                        if (idProfil == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                            me.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                            me.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                        }
                        if (enemyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                            enemy.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                            enemy.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                        }
                    }
                }

                objTmp.me = me;
                objTmp.enemy = enemy;

            } else if (gameData.template.data.mode == "2v2") {
                if (gameData.server_data.PlayerData[3]) {
                    if (gameData.win[0] == idProfil || gameData.win[1] == idProfil) {
                        objTmp.result = 'win';
                    } else {
                        objTmp.result = 'lose';
                    }
                    if (gameData.server_data.PlayerData[0].AccountId == idProfil) {
                        myId = 0;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;

                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            enemyId = 2;
                            enemyAccountId = gameData.server_data.PlayerData[2].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[1].AccountId == idProfil) {
                        myId = 1;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            enemyId = 2;
                            enemyAccountId = gameData.server_data.PlayerData[2].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[2].AccountId == idProfil) {
                        myId = 2;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                            allyId = 3;
                            allyAccountId = gameData.server_data.PlayerData[3].AccountId;
                        }
                        
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                                enemyId2 = 1;
                                enemyAccountId2 = gameData.server_data.PlayerData[1].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[3].TeamIndex) {
                                enemyId2 = 3;
                                enemyAccountId2 = gameData.server_data.PlayerData[3].AccountId;
                            }
                        }
                    } else if (gameData.server_data.PlayerData[3].AccountId == idProfil) {
                        myId = 3;
                        allyTeamId = gameData.server_data.PlayerData[myId].TeamIndex;
                        if (allyTeamId == 0) {
                            enemyTeamId = 1;
                        } else if (allyTeamId == 1) {
                            enemyTeamId = 0;
                        }
                        if (allyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            allyId = 0;
                            allyAccountId = gameData.server_data.PlayerData[0].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            allyId = 1;
                            allyAccountId = gameData.server_data.PlayerData[1].AccountId;
                        } else if (allyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                            allyId = 2;
                            allyAccountId = gameData.server_data.PlayerData[2].AccountId;
                        }
                        if (enemyTeamId == gameData.server_data.PlayerData[0].TeamIndex) {
                            enemyId = 0;
                            enemyAccountId = gameData.server_data.PlayerData[0].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                                enemyId2 = 1;
                                enemyAccountId2 = gameData.server_data.PlayerData[1].AccountId;
                            }
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                        } else if (enemyTeamId == gameData.server_data.PlayerData[1].TeamIndex) {
                            enemyId = 1;
                            enemyAccountId = gameData.server_data.PlayerData[1].AccountId;
                            if (enemyTeamId == gameData.server_data.PlayerData[2].TeamIndex) {
                                enemyId2 = 2;
                                enemyAccountId2 = gameData.server_data.PlayerData[2].AccountId;
                            }
                        }
                    }
                    
                    let yearCreatedAt = Number((gameData.created_at).slice(0,4));
                    let monthCreatedAt = Number((gameData.created_at).slice(5,7));
                    let dayCreatedAt = Number((gameData.created_at).slice(8,10));
                    let hoursCreatedAt = Number((gameData.created_at).slice(11,13));
                    let minutesCreatedAt = Number((gameData.created_at).slice(14,16));
                    let dateCreatedAt = new Date(yearCreatedAt, monthCreatedAt, dayCreatedAt, hoursCreatedAt, minutesCreatedAt);

                    let yearCompletionTime = Number((gameData.completion_time).slice(0,4));
                    let monthCompletionTime = Number((gameData.completion_time).slice(5,7));
                    let dayCompletionTime = Number((gameData.completion_time).slice(8,10));
                    let hoursCompletionTime = Number((gameData.completion_time).slice(11,13));
                    let minutesCompletionTime = Number((gameData.completion_time).slice(14,16));
                    let dateCompletionTime = new Date(yearCompletionTime, monthCompletionTime, dayCompletionTime, hoursCompletionTime, minutesCompletionTime);
                    
                    objTmp.duration = getDuration(dateCreatedAt, dateCompletionTime);
                    
                    me.character = nameCharacter((gameData.server_data.PlayerData[myId].CharacterSlug).slice(10,999));
                    me.username = gameData.server_data.PlayerData[myId].Username;
                    me.accountId = gameData.server_data.PlayerData[myId].AccountId;
                    me.damageDone = gameData.server_data.PlayerData[myId].DamageDone;
                    me.ringOuts = gameData.server_data.PlayerData[myId].Ringouts;
                    me.deaths = gameData.server_data.PlayerData[myId].Deaths;
                    me.teamId = gameData.server_data.PlayerData[myId].TeamIndex;
                    me.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[myId].TeamIndex];

                    ally.character = nameCharacter((gameData.server_data.PlayerData[allyId].CharacterSlug).slice(10,999));
                    ally.username = gameData.server_data.PlayerData[allyId].Username;
                    ally.accountId = gameData.server_data.PlayerData[allyId].AccountId;
                    ally.damageDone = gameData.server_data.PlayerData[allyId].DamageDone;
                    ally.ringOuts = gameData.server_data.PlayerData[allyId].Ringouts;
                    ally.deaths = gameData.server_data.PlayerData[allyId].Deaths;
                    ally.teamId = gameData.server_data.PlayerData[allyId].TeamIndex;
                    ally.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[allyId].TeamIndex];

                    enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                    enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                    enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                    enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                    enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                    enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                    enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                    enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];

                    enemy2.character = nameCharacter((gameData.server_data.PlayerData[enemyId2].CharacterSlug).slice(10,999));
                    enemy2.username = gameData.server_data.PlayerData[enemyId2].Username;
                    enemy2.accountId = gameData.server_data.PlayerData[enemyId2].AccountId;
                    enemy2.damageDone = gameData.server_data.PlayerData[enemyId2].DamageDone;
                    enemy2.ringOuts = gameData.server_data.PlayerData[enemyId2].Ringouts;
                    enemy2.deaths = gameData.server_data.PlayerData[enemyId2].Deaths;
                    enemy2.teamId = gameData.server_data.PlayerData[enemyId2].TeamIndex;
                    enemy2.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId2].TeamIndex];
                    
                    if (gameData.data.ratingUpdates) {
                        for (let j = 0; j < (gameData.data.ratingUpdates.playerRatingChanges).length; j++) {
                            if (idProfil == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                me.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                me.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (allyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                ally.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                ally.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (enemyAccountId == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                enemy.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                enemy.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                            if (enemyAccountId2 == gameData.data.ratingUpdates.playerRatingChanges[j].playerAccountID) {
                                enemy2.preMmr = gameData.data.ratingUpdates.playerRatingChanges[j].preMatchRating.mean;
                                enemy2.postMmr = gameData.data.ratingUpdates.playerRatingChanges[j].postMatchRating.mean;
                            }
                        }
                    }
                    
                    objTmp.me = me;
                    objTmp.ally = ally;
                    objTmp.enemy = enemy;
                    objTmp.enemy2 = enemy2;
                }
            }
            matches[i] = objTmp;
        }
    }
    var obj = {};
    obj.matches = matches;
    return obj;
};

module.exports = {dataMatchs, dataMoreMatchs};