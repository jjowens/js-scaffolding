const templateDirPath = "./lib/templates/";
const fs = require('fs');
const {execSync} = require('child_process');

function generateProjects(obj, data) {
	let fileContents = data;

    let dirName = obj.projectName;

    runCommand("mkdir " + dirName);

    dirName = dirName + "/";
	
    fileContents = fileContents.replace(/##DIRNAME##/g, dirName);
	fileContents = fileContents.replace(/##DATABASE_CONNECTION##/g, obj.databaseConnection);
	fileContents = fileContents.replace(/##PROJECTNAME##/g, obj.projectName);

	let arrayCommands = fileContents.split("\n");

	for (let i = 0; i < arrayCommands.length; i++) {
		if (arrayCommands[i].length <= 1) {
			continue;
		}
		
		console.log(arrayCommands[i]);
        runCommand(arrayCommands[i]);
	}
}

function runCommand(cmdStr) {
    execSync(cmdStr);
}

exports.run = function runScaffold(obj) {
    if (obj.projectName == undefined) {
        obj.projectName = "NewProject";
    }
    
    obj.templateFilePath = templateDirPath + obj.templateName + ".txt";

    fs.readFile(obj.templateFilePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        
        generateProjects(obj, data);
    });
}




