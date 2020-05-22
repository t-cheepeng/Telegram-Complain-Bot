const fs = require('fs');

module.exports.getBotToken = function (filePath) {
    return fs.readFileSync(filePath);
}