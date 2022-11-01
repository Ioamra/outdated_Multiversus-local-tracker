const { connectApi, deepFind, getAllCharacters, nameCharacter } = require("./functions");
const { Client } = require('multiversus.js');

const dataLeaderboard = async (page = 1) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const leaderboardData1v1 = await client.leaderboards.fetch('1v1', page);
    const leaderboardData2v2 = await client.leaderboards.fetch('2v2', page);
    var allCharacters = getAllCharacters();
    var obj = {};
    var leaderboard1v1 = {};
    var leaderboard2v2 = {};
    obj.charactersList = allCharacters;
    
    for (let i = 0; i < 25; i++) {
        let objTmp1v1 = {};
        let objTmp2v2 = {};
        objTmp1v1.rank = leaderboardData1v1.leaders[i].rank;
        objTmp1v1.name = leaderboardData1v1.leaders[i].account.identity.alternate.wb_network[0].username;
        if (leaderboardData1v1.leaders[i].account.identity.alternate.twitch) {
            objTmp1v1.nameTwitch = leaderboardData1v1.leaders[i].account.identity.alternate.twitch[0].username;
        }
        objTmp1v1.totalMatch = leaderboardData1v1.leaders[i].profile["1v1"].win + leaderboardData1v1.leaders[i].profile["1v1"].loss;
        objTmp1v1.win = leaderboardData1v1.leaders[i].profile["1v1"].win;
        objTmp1v1.lose = leaderboardData1v1.leaders[i].profile["1v1"].loss;
        objTmp1v1.mmr = Math.round(leaderboardData1v1.leaders[i].score * 100) / 100;

        const tmpProfilesData1v1 = await client.profiles.fetch(leaderboardData1v1.leaders[i].profile.account_id);
        const tmpAccountsData1v1 = await client.accounts.fetch(leaderboardData1v1.leaders[i].profile.account_id);
        objTmp1v1.topRatingCharacter = nameCharacter((tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character).slice(10,999));
        objTmp1v1.avatar = tmpAccountsData1v1.server_data.ProfileIcon.Slug;

        if (deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character + '.PerkPages') != undefined) {
            objTmp1v1.perks1 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[0];
            objTmp1v1.perks2 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[1];
            objTmp1v1.perks3 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[2];
            objTmp1v1.perks4 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + tmpProfilesData1v1.server_data["1v1shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[3];
        } else {
            objTmp1v1.perks1 = "";
            objTmp1v1.perks2 = "";
            objTmp1v1.perks3 = "";
            objTmp1v1.perks4 = "";
        }

        objTmp2v2.rank = leaderboardData2v2.leaders[i].rank;
        objTmp2v2.name = leaderboardData2v2.leaders[i].account.identity.alternate.wb_network[0].username;
        if (leaderboardData2v2.leaders[i].account.identity.alternate.twitch) {
            objTmp2v2.nameTwitch = leaderboardData2v2.leaders[i].account.identity.alternate.twitch[0].username;
        }
        objTmp2v2.totalMatch = leaderboardData2v2.leaders[i].profile["2v2"].win + leaderboardData2v2.leaders[i].profile["2v2"].loss;
        objTmp2v2.win = leaderboardData2v2.leaders[i].profile["2v2"].win;
        objTmp2v2.lose = leaderboardData2v2.leaders[i].profile["2v2"].loss;
        objTmp2v2.mmr = Math.round(leaderboardData2v2.leaders[i].score * 100) / 100;

        const tmpProfilesData2v2 = await client.profiles.fetch(leaderboardData2v2.leaders[i].profile.account_id);
        const tmpAccountsData2v2 = await client.accounts.fetch(leaderboardData2v2.leaders[i].profile.account_id);
        objTmp2v2.topRatingCharacter = nameCharacter((tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character).slice(10,999));
        objTmp2v2.avatar = tmpAccountsData2v2.server_data.ProfileIcon.Slug;
        
        if (deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character + '.PerkPages') != undefined) {
            objTmp2v2.perks1 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[0];
            objTmp2v2.perks2 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[1];
            objTmp2v2.perks3 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[2];
            objTmp2v2.perks4 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + tmpProfilesData2v2.server_data["2v2shuffle"][0].topRating.character + '.PerkPages')[0].PerkSlugs[3];
        } else {
            objTmp2v2.perks1 = "";
            objTmp2v2.perks2 = "";
            objTmp2v2.perks3 = "";
            objTmp2v2.perks4 = "";
        }

        leaderboard1v1[i] = objTmp1v1;
        leaderboard2v2[i] = objTmp2v2;
    }
    obj.leaderboard1v1 = leaderboard1v1;
    obj.leaderboard2v2 = leaderboard2v2;
    
    return obj;
}

const dataLeaderboardCharacter = async (character, page = 1) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const leaderboardData1v1 = await client.leaderboards.fetchCharacter('1v1', character, page);
    const leaderboardData2v2 = await client.leaderboards.fetchCharacter('2v2', character, page);
    var allCharacters = getAllCharacters();
    var obj = {};
    var leaderboard1v1 = {};
    var leaderboard2v2 = {};
    obj.charactersList = allCharacters;
    
    for (let i = 0; i < 25; i++) {
        let objTmp1v1 = {};
        let objTmp2v2 = {};
        objTmp1v1.rank = leaderboardData1v1.leaders[i].rank;
        objTmp1v1.name = leaderboardData1v1.leaders[i].account.identity.alternate.wb_network[0].username;
        if (leaderboardData1v1.leaders[i].account.identity.alternate.twitch) {
            objTmp1v1.nameTwitch = leaderboardData1v1.leaders[i].account.identity.alternate.twitch[0].username;
        }
        objTmp1v1.mmr = Math.round(leaderboardData1v1.leaders[i].score * 100) / 100;

        const tmpProfilesData1v1 = await client.profiles.fetch(leaderboardData1v1.leaders[i].profile.account_id);
        const tmpAccountsData1v1 = await client.accounts.fetch(leaderboardData1v1.leaders[i].profile.account_id);
        objTmp1v1.avatar = tmpAccountsData1v1.server_data.ProfileIcon.Slug;
        objTmp1v1.win = toZeroIfNotExist(deepFind(tmpProfilesData1v1, 'server_data.stat_trackers.character_wins.' + character));

        if (deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + character + '.PerkPages') != undefined) {
            objTmp1v1.perks1 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[0];
            objTmp1v1.perks2 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[1];
            objTmp1v1.perks3 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[2];
            objTmp1v1.perks4 = deepFind(tmpProfilesData1v1, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[3];
        } else {
            objTmp1v1.perks1 = "";
            objTmp1v1.perks2 = "";
            objTmp1v1.perks3 = "";
            objTmp1v1.perks4 = "";
        }

        objTmp2v2.rank = leaderboardData2v2.leaders[i].rank;
        objTmp2v2.name = leaderboardData2v2.leaders[i].account.identity.alternate.wb_network[0].username;
        if (leaderboardData2v2.leaders[i].account.identity.alternate.twitch) {
            objTmp2v2.nameTwitch = leaderboardData2v2.leaders[i].account.identity.alternate.twitch[0].username;
        }
        objTmp2v2.mmr = Math.round(leaderboardData2v2.leaders[i].score * 100) / 100;

        const tmpProfilesData2v2 = await client.profiles.fetch(leaderboardData2v2.leaders[i].profile.account_id);
        const tmpAccountsData2v2 = await client.accounts.fetch(leaderboardData2v2.leaders[i].profile.account_id);
        objTmp2v2.avatar = tmpAccountsData2v2.server_data.ProfileIcon.Slug;
        objTmp2v2.win = toZeroIfNotExist(deepFind(tmpProfilesData2v2, 'server_data.stat_trackers.character_wins.' + character));
        
        if (deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + character + '.PerkPages') != undefined) {
            objTmp2v2.perks1 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[0];
            objTmp2v2.perks2 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[1];
            objTmp2v2.perks3 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[2];
            objTmp2v2.perks4 = deepFind(tmpProfilesData2v2, 'data.PerkPreferences.Characters.' + character + '.PerkPages')[0].PerkSlugs[3];
        } else {
            objTmp2v2.perks1 = "";
            objTmp2v2.perks2 = "";
            objTmp2v2.perks3 = "";
            objTmp2v2.perks4 = "";
        }

        leaderboard1v1[i] = objTmp1v1;
        leaderboard2v2[i] = objTmp2v2;
    }
    obj.leaderboard1v1 = leaderboard1v1;
    obj.leaderboard2v2 = leaderboard2v2;
    obj.character = nameCharacter((character).slice(10,999));

    return obj;
}

module.exports = {dataLeaderboard, dataLeaderboardCharacter};
