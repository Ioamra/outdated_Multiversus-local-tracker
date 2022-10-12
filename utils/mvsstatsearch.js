const { connectApi } = require("./functions");
const { Client } = require('multiversus.js');

const searchAccount = async (name) => {
    const token = await connectApi();
    const client = new Client({ accessToken: token });
    const searchData = await client.profiles.search(name);
    var obj = {};
    var result = [];
    if (searchData.total == 0) {
        obj.error = "notExist";
        return obj;
    } else if (searchData.total > 10) {
        obj.error = "notSpecificEnough";
        return obj;
    } else {
        for (let i = 0; i < searchData.total; i++) {
            let objTmp = {};
            idProfilTmp = searchData.results[i].result.account_id;
            const accountsData = await client.accounts.fetch(idProfilTmp);
            objTmp.avatar  = accountsData.server_data.ProfileIcon.Slug;
            objTmp.username = accountsData.identity.alternate.wb_network[0].username;
            objTmp.level = accountsData.server_data.Level;
            result[i] = objTmp;
        }
        obj.result = result;
        return obj;
    }
}

module.exports = { searchAccount };