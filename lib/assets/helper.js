const fs = require('fs');

exports.ToBoolean = function(val) {
    let results = false;

    if (val !== undefined) {
        results = val;
    }

    return results;
}

exports.WriteToFile = function(filePath, data) {
    let newLine = data + "\r\n";

    fs.appendFile(filePath, newLine, (err) => {
        if (err) {
            console.log("Failed to write to file");
            console.log(err);
        }
    });
}

exports.DeleteFileFolder = function(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}