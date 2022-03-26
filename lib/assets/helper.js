const fs = require('fs');

exports.ToBoolean = function(val) {
    let results = false;

    if (val !== undefined) {
        results = val;
    }

    return results;
}

exports.WriteToFile = function(filePath, data) {
    let newLine = data + "\r\n\r\n" ;

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

exports.HasIgnoreFlag = function (obj) {
    let ignoreFlag = false;

    if (obj === undefined) {
        return ignoreFlag;
    }
    
    if (obj["ignore"] !== undefined && obj["ignore"] === true) {
        ignoreFlag = true;
    }

    return ignoreFlag;
}

exports.CheckBooleanFlag = function (obj, flagName) {
    let ignoreFlag = false;

    if (obj === undefined) {
        return ignoreFlag;
    }
    
    if (obj[flagName] !== undefined && obj[flagName] === true) {
        ignoreFlag = true;
    }

    return ignoreFlag;
}

exports.CheckBooleanFlagWithDefault = function (obj, flagName, defaultVal) {
    let flag = defaultVal;

    if (obj === undefined) {
        return flag;
    }
    
    if (obj[flagName] !== undefined && obj[flagName] === true) {
        flag = true;
    }

    return flag;
}

exports.CreateTimeStampedFileName = function(filename, suffixFileName, fileExtension) {
    let date = new Date();

    let yearStr = date.getFullYear().toString().padStart(2, "0");
    let monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
    let dayStr = date.getDate().toString().padStart(2, "0");
    let hourStr = date.getHours().toString().padStart(2, "0");
    let minStr = date.getMinutes().toString().padStart(2, "0");
    let secStr = date.getMinutes().toString().padStart(2, "0");

    let timeStampFile = yearStr + "-" + monthStr + "-" + dayStr;
    timeStampFile = timeStampFile + "-" + hourStr + "" + minStr + "" + secStr;
    
    let results = filename + "-" + timeStampFile + suffixFileName + "." + fileExtension;

    return results;
}

