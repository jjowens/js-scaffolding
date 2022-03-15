const templatename = process.env.npm_config_templatename;
const projectName = process.env.npm_config_projectname;
const templateDirPath = "./lib/templates/";
let templateFilePath = "";
const {execSync} = require('child_process')

templateFilePath = templateDirPath + templatename + ".txt";

console.log("templateName: " + templatename);
console.log("templateFilePath: " + templateFilePath);
console.log("project name: " + projectName);

if (projectName == undefined) {
    projectName = "Golf";
}

const fs = require('fs');

let fileContents = '';

fs.readFile(templateFilePath, 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	
	generateProjects(data);
});

function generateProjects(data) {
	fileContents = data;

    let dirName = projectName;

    runCommand("mkdir " + dirName);

    dirName = dirName + "/";
	
    fileContents = fileContents.replace(/##DIRNAME##/g, dirName);
	fileContents = fileContents.replace(/##PROJECTNAME##/g, projectName);
	
	//console.log(fileContents);
	
	let arrayCommands = fileContents.split("\n");

	for (let i = 0; i < arrayCommands.length; i++) {
		if (arrayCommands[i].length <= 1) {
			continue;
		}
		
		console.log(arrayCommands[i]);
		execSync(arrayCommands[i]);
	}
	
	//execSync("dotnet new sln");
	
}

function runCommand(cmdStr) {
    execSync(cmdStr);
}




