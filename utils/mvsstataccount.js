const { connectApi, deepFind, toZeroIfNotExist, getDuration, nameCharacter, nameMap } = require("./functions");
const { Client } = require('multiversus.js');

const dataAccount = async (name) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const searchData = await client.profiles.search(name);
    if (searchData.total == 0) {
        let res = {};
        res.error = 'Le profil n\'a pas été trouvé.';
        return res;
    }
    let accountsDataTmp, idProfilTmp;
    var idProfil;
    idProfil = searchData.results[0].result.account_id;
    
    for (let i = 0; i < searchData.results.length; i++) {
        idProfilTmp = searchData.results[i].result.account_id;
        accountsDataTmp = await client.accounts.fetch(idProfilTmp);
        if (accountsDataTmp.identity.alternate.wb_network[0].username == name) {
            idProfil = searchData.results[i].result.account_id;
        }
    }

    const profilesData = await client.profiles.fetch(idProfil);
    const accountsData = await client.accounts.fetch(idProfil);
    const rankGlobal1v1 = await client.leaderboards.fetch('1v1');
    const rankGlobal2v2 = await client.leaderboards.fetch('2v2');
    const rankProfile1v1 = await client.leaderboards.fetchProfile(idProfil, '1v1');
    const rankProfile2v2 = await client.leaderboards.fetchProfile(idProfil, '2v2');

    var obj = {};
    var globals = {};
    var stat1v1 = {};
    var stat2v2 = {};
    

    globals.lastLoginTime = new Date((new Date(accountsData.server_data.LastLoginTime)).getTime() + (3600000)*3);
    globals.lastLogoutTime = new Date((new Date(accountsData.server_data.LastLogoutTime)).getTime() + (3600000)*2);


    globals.created_at = profilesData.created_at;
    globals.avatar  = accountsData.server_data.ProfileIcon.Slug;
    globals.username = accountsData.identity.alternate.wb_network[0].username;
    globals.level = accountsData.server_data.Level;
    if (accountsData.identity.alternate.twitch) {
        globals.nameTwitch = accountsData.identity.alternate.twitch[0].username
    }
    if (profilesData["1v1"] && profilesData["2v2"]) {
        globals.totalMatch = toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win) + toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win);
        globals.win = toZeroIfNotExist(profilesData["1v1"].win) + toZeroIfNotExist(profilesData["2v2"].win);
        globals.lose = toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["2v2"].loss);
        globals.percentageWin = (toZeroIfNotExist((profilesData["1v1"].win) + toZeroIfNotExist(profilesData["2v2"].win)) / (toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win) + toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win)) * 100);    
    } else if (profilesData["1v1"]) {
        globals.totalMatch = toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win);
        globals.win = toZeroIfNotExist(profilesData["1v1"].win);
        globals.lose = toZeroIfNotExist(profilesData["1v1"].loss);
        globals.percentageWin = toZeroIfNotExist(profilesData["1v1"].win) * 100 / (toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win));    
    } else if (profilesData["2v2"]) {
        globals.totalMatch = toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win);
        globals.win = toZeroIfNotExist(profilesData["2v2"].win);
        globals.lose = toZeroIfNotExist(profilesData["2v2"].loss);
        globals.percentageWin = toZeroIfNotExist(profilesData["2v2"].win) * 100 / (toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win));    
    }
    globals.totalAssists = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalAssists);
    globals.highestDamageDealt = toZeroIfNotExist(profilesData.server_data.stat_trackers.HighestDamageDealt);
    globals.totalMaxedCharacters = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalMaxedCharacters);
    globals.lifetimeDamage = toZeroIfNotExist(profilesData.server_data.lifetime_damage);
    globals.totalDoubleRingouts = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalDoubleRingouts);
    globals.totalRingoutLeader = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalRingoutLeader);
    globals.totalRingouts = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalRingouts);
    globals.totalAttacksDodged = toZeroIfNotExist(profilesData.server_data.stat_trackers.TotalAttacksDodged);
    if (profilesData["1v1"]) {

        stat1v1.topRatingCharacter = nameCharacter((profilesData.server_data["1v1shuffle"][0].topRating.character).slice(10,999));
        stat1v1.totalPlayers = rankGlobal1v1.total_leaders;
        stat1v1.totalMatch = toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win);
        stat1v1.percentageWin = toZeroIfNotExist(profilesData["1v1"].win) * 100 / (toZeroIfNotExist(profilesData["1v1"].loss) + toZeroIfNotExist(profilesData["1v1"].win));
        stat1v1.win = toZeroIfNotExist(profilesData["1v1"].win);
        stat1v1.lose = toZeroIfNotExist(profilesData["1v1"].loss);
        stat1v1.rank = toZeroIfNotExist(rankProfile1v1.rank);
        stat1v1.score = toZeroIfNotExist(rankProfile1v1.score);
        stat1v1.top = toZeroIfNotExist(rankProfile1v1.rank) / rankGlobal1v1.total_leaders * 100;
        stat1v1.longestWinStreak = toZeroIfNotExist(profilesData["1v1"].longest_win_streak);
        stat1v1.winStreak = toZeroIfNotExist(profilesData["1v1"].win_streak);
    }
    
    if (profilesData["2v2"]) {
        stat2v2.topRatingCharacter = nameCharacter((profilesData.server_data["2v2shuffle"][0].topRating.character).slice(10,999));
        stat2v2.totalPlayers = rankGlobal2v2.total_leaders;
        stat2v2.totalMatch = toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win);
        stat2v2.percentageWin = toZeroIfNotExist(profilesData["2v2"].win) * 100 / (toZeroIfNotExist(profilesData["2v2"].loss) + toZeroIfNotExist(profilesData["2v2"].win));
        stat2v2.win = toZeroIfNotExist(profilesData["2v2"].win);
        stat2v2.lose = toZeroIfNotExist(profilesData["2v2"].loss);
        stat2v2.rank = toZeroIfNotExist(rankProfile2v2.rank);
        stat2v2.score = toZeroIfNotExist(rankProfile2v2.score);
        stat2v2.top = toZeroIfNotExist(rankProfile2v2.rank) / rankGlobal2v2.total_leaders * 100;
        stat2v2.longestWinStreak = toZeroIfNotExist(profilesData["2v2"].longest_win_streak);
        stat2v2.winStreak = toZeroIfNotExist(profilesData["2v2"].win_streak);
    }
    obj.globals = globals;
    if (profilesData["1v1"]) { obj.stat1v1 = stat1v1; }
    if (profilesData["2v2"]) { obj.stat2v2 = stat2v2; }

    var charactersPlayed = {};
    var allCharactersPlayed = profilesData.server_data.stat_trackers.character_wins;
    var x = 0;
    for (let key in allCharactersPlayed) {
        let objTmp = {};
        
        objTmp.name = nameCharacter(key.slice(10,999));
        if (deepFind(accountsData, 'server_data.Characters.' + key + '.Mastery.Level') != undefined) {
            objTmp.level = deepFind(accountsData, 'server_data.Characters.' + key + '.Mastery.Level');
        } else {
            objTmp.level = 0;
        }
        const rankGlobalCharacter1v1 = await client.leaderboards.fetchCharacter('1v1', key);
        const rankGlobalCharacter2v2 = await client.leaderboards.fetchCharacter('2v2', key);
        const rankProfileCharacter1v1 = await client.leaderboards.fetchProfileCharacter(idProfil, '1v1', key);
        const rankProfileCharacter2v2 = await client.leaderboards.fetchProfileCharacter(idProfil, '2v2', key);
        objTmp.win = toZeroIfNotExist(deepFind(profilesData, 'server_data.stat_trackers.character_wins.' + key));

        objTmp.rank1v1 = rankProfileCharacter1v1.rank;
        objTmp.score1v1 = rankProfileCharacter1v1.score;
        objTmp.totalPlayers1v1 = rankGlobalCharacter1v1.total_leaders;
        objTmp.top1v1 = toZeroIfNotExist(rankProfileCharacter1v1.rank) / rankGlobalCharacter1v1.total_leaders * 100;

        objTmp.rank2v2 = rankProfileCharacter2v2.rank;
        objTmp.score2v2 = rankProfileCharacter2v2.score;
        objTmp.totalPlayers2v2 = rankGlobalCharacter2v2.total_leaders;
        objTmp.top2v2 = toZeroIfNotExist(rankProfileCharacter2v2.rank) / rankGlobalCharacter2v2.total_leaders * 100;

        if (deepFind(profilesData, 'data.PerkPreferences.Characters.' + key + '.PerkPages') != undefined) {
            objTmp.perks1 = deepFind(profilesData, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[0];
            objTmp.perks2 = deepFind(profilesData, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[1];
            objTmp.perks3 = deepFind(profilesData, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[2];
            objTmp.perks4 = deepFind(profilesData, 'data.PerkPreferences.Characters.' + key + '.PerkPages')[0].PerkSlugs[3];
        } else {
            objTmp.perks1 = "";
            objTmp.perks2 = "";
            objTmp.perks3 = "";
            objTmp.perks4 = "";
        }
        const objForStreak1v1 = profilesData.server_data["1v1shuffle"][0];
        objTmp.streak1v1 = deepFind(objForStreak1v1, 'ratings.' + key + '.streak');
        const objForStreak2v2 = profilesData.server_data["2v2shuffle"][0];
        objTmp.streak2v2 = deepFind(objForStreak2v2, 'ratings.' + key + '.streak');
        charactersPlayed[x] = objTmp;
        x += 1;
    }
    obj.charactersPlayed = charactersPlayed;

    const matchesData = await client.matches.fetchAll(idProfil, 1);
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
                
                if (gameData.server_data.PlayerData[enemyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                    enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                } else {
                    enemy.username = "BOT";
                }
                enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];
                if (gameData.data.ratingUpdates) {
                    if (gameData.data.ratingUpdates.player_rating_changes) {
                        for (let j = 0; j < (gameData.data.ratingUpdates.player_rating_changes).length; j++) {
                            if (idProfil == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                me.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                me.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                            }
                            if (enemyAccountId == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                enemy.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                enemy.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                            }
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
                    
                    if (gameData.server_data.PlayerData[allyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                        ally.username = gameData.server_data.PlayerData[allyId].Username;
                    } else {
                        ally.username = "BOT";
                    }
                    ally.character = nameCharacter((gameData.server_data.PlayerData[allyId].CharacterSlug).slice(10,999));    
                    ally.accountId = gameData.server_data.PlayerData[allyId].AccountId;
                    ally.damageDone = gameData.server_data.PlayerData[allyId].DamageDone;
                    ally.ringOuts = gameData.server_data.PlayerData[allyId].Ringouts;
                    ally.deaths = gameData.server_data.PlayerData[allyId].Deaths;
                    ally.teamId = gameData.server_data.PlayerData[allyId].TeamIndex;
                    ally.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[allyId].TeamIndex];

                    if (gameData.server_data.PlayerData[enemyId].AccountId.slice(0,3).toLowerCase() != 'bot') {
                        enemy.username = gameData.server_data.PlayerData[enemyId].Username;
                    } else {
                        enemy.username = "BOT";
                    }
                    enemy.character = nameCharacter((gameData.server_data.PlayerData[enemyId].CharacterSlug).slice(10,999));
                    enemy.accountId = gameData.server_data.PlayerData[enemyId].AccountId;
                    enemy.damageDone = gameData.server_data.PlayerData[enemyId].DamageDone;
                    enemy.ringOuts = gameData.server_data.PlayerData[enemyId].Ringouts;
                    enemy.deaths = gameData.server_data.PlayerData[enemyId].Deaths;
                    enemy.teamId = gameData.server_data.PlayerData[enemyId].TeamIndex;
                    enemy.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId].TeamIndex];
                    
                    if (gameData.server_data.PlayerData[enemyId2].AccountId.slice(0,3).toLowerCase() != 'bot') {
                        enemy2.username = gameData.server_data.PlayerData[enemyId2].Username;
                    } else {
                        enemy2.username = "BOT";
                    }
                    enemy2.character = nameCharacter((gameData.server_data.PlayerData[enemyId2].CharacterSlug).slice(10,999));
                    enemy2.accountId = gameData.server_data.PlayerData[enemyId2].AccountId;
                    enemy2.damageDone = gameData.server_data.PlayerData[enemyId2].DamageDone;
                    enemy2.ringOuts = gameData.server_data.PlayerData[enemyId2].Ringouts;
                    enemy2.deaths = gameData.server_data.PlayerData[enemyId2].Deaths;
                    enemy2.teamId = gameData.server_data.PlayerData[enemyId2].TeamIndex;
                    enemy2.teamScore = gameData.server_data.TeamScores[gameData.server_data.PlayerData[enemyId2].TeamIndex];
                    if (gameData.data.ratingUpdates) {
                        if (gameData.data.ratingUpdates.player_rating_changes) {               
                            for (let j = 0; j < (gameData.data.ratingUpdates.player_rating_changes).length; j++) {
                                if (idProfil == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                    me.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                    me.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                                }
                                if (allyAccountId == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                    ally.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                    ally.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                                }
                                if (enemyAccountId == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                    enemy.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                    enemy.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                                }
                                if (enemyAccountId2 == gameData.data.ratingUpdates.player_rating_changes[j].player_account_id) {
                                    enemy2.preMmr = gameData.data.ratingUpdates.player_rating_changes[j].pre_match_rating.mean;
                                    enemy2.postMmr = gameData.data.ratingUpdates.player_rating_changes[j].post_match_rating.mean;
                                }
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
    obj.matches = matches;
    return obj;
}

module.exports = {dataAccount};