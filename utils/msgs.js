const moment = require('moment');

function formatmsg(username, text){
    return {
        username,
        text,
        time: moment().format('hh:mm a')
    };
}

module.exports = formatmsg;