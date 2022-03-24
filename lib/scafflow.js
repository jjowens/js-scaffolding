const templateDirPath = "./lib/templates/";
const fs = require('fs');
const {execSync} = require('child_process');
const { Console } = require('console');
const helper = require('./assets/helper');

let _workflow;

exports.printMsg = function() {
    console.log("Ready to scafflow");
}

exports.run = function(parameters) {
    parseJsonFile(parameters, parameters.Workflow);
}

function runCommand(cmdStr) {

    if (_workflow.DisplayCommand) {
        console.log(cmdStr);
    }

    if (_workflow.ExportToFile) {
        helper.WriteToFile(_workflow.ExportFilePath, cmdStr);
    }

    if (!_workflow.DryRun) {
        execSync(cmdStr);
    }
    
}

function parseJsonFile(parameters, filePath) {
    console.log(filePath);

    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        let jsonData = JSON.parse(data);

        startProcess(parameters, jsonData);
    });
}

function startProcess(parameters, jsonData) {
    _workflow = createWorkflow(parameters, jsonData);

    //console.table(workflow);

    // CREATE SOLUTION FILE
    createSolution(_workflow);

    // CREATE PROJECTS
    if (_workflow.Projects !== undefined) {
        // CREATE PROJECTS
        _workflow.Projects.forEach(projectItem => {
            console.log(projectItem["project-file-name"]);
            console.log(projectItem["project-file-path"]);
            createProject(projectItem);

            addPackages(projectItem);

            addProjectToSolution(projectItem);

            addEntityFrameworks(projectItem);
        });

        // ADD REFERENCES
        _workflow.Projects.forEach(projectItem => {
            addReferences(projectItem);
        });
    }

}

function createWorkflow(obj, jsonData) {
    let workflow = new Object();
    workflow.SolutionName = jsonData["solution-name"];
    workflow.SolutionPath = createFilePath(jsonData["directory-path"], jsonData["solution-name"]);
    workflow.RootDirectory = jsonData["directory-path"];
    workflow.DisplayCommand = helper.ToBoolean(jsonData["display-command"]);
    workflow.ExportToFile = helper.ToBoolean(jsonData["export-to-file"]);
    workflow.DryRun = helper.ToBoolean(jsonData["dry-run"]);
    workflow.Projects = jsonData["projects"];
    workflow.ExportFilePath = jsonData["solution-name"] + "_commands.txt";
    workflow.Actions = jsonData["projects"];

    if (workflow.Projects !== undefined) {
        for(let idx=0; idx < workflow.Projects.length; idx++) {
            let projectFileName = workflow.Projects[idx]["namespace"] + ".csproj";
            let projectFileNameWithOutExtension = workflow.Projects[idx]["namespace"];
            let projectFilePath = createFilePath(jsonData["directory-path"], projectFileNameWithOutExtension);

            workflow.Projects[idx]["project-file-name"] = projectFileName;
            workflow.Projects[idx]["project-file-name-without-extension"] = projectFileNameWithOutExtension;
            workflow.Projects[idx]["project-file-path"] = projectFilePath;
        }
    }

    return workflow;
}

function createFilePath(dirPath, fileName) {
    let fullPath = "";

    if (dirPath !== undefined) {
        fullPath = dirPath + "/";
    }

    fullPath = fullPath + fileName;

    return fullPath;
}

function createSolution(obj) {
    let cmdStr = "dotnet new sln -o ";

    cmdStr = cmdStr + "\"" + obj.SolutionPath + "\"";

    runCommand(cmdStr);
}

function createProject(projectItem) {
    // dotnet new classlib --framework "netcoreapp3.1" -o "##DIRNAME####PROJECTNAME##.Models"

    let cmdStr = "dotnet new ";

    cmdStr = cmdStr + projectItem["project-type"] + " ";

    if (projectItem["framework"] !== undefined) {
        cmdStr = cmdStr + "--framework \"" + projectItem["framework"]  + "\" "
    }

    //let tempPath = createFilePath(_workflow.RootDirectory, projectItem["namespace"]);

    cmdStr = cmdStr + "-o " + "\"" + projectItem["project-file-path"] + "\"";

    runCommand(cmdStr);
}

function addPackages(projectItem) {
    if (projectItem["packages"] === undefined) {
        return;
    }

    projectItem["packages"].forEach(packageItem => {
        addPackage(projectItem, packageItem);
    });

}

function addPackage(projectItem, packageItem) {
    // dotnet add "##DIRNAME####PROJECTNAME##.Engine/##PROJECTNAME##.Engine.csproj" package Microsoft.EntityFrameworkCore.SqlServer --version 5.0.15
    let cmdStr = "dotnet add ";

    cmdStr = cmdStr + "\"" + projectItem["project-file-path"] + "\"" + " package ";

    cmdStr = cmdStr + packageItem["name"] + " ";

    if (packageItem["version"] !== undefined) {
        cmdStr = cmdStr + "--version " + packageItem["version"];
    }

    runCommand(cmdStr);

}

function addProjectToSolution(projectItem) {
    //dotnet sln "##DIRNAME####PROJECTNAME##" add ##DIRNAME####PROJECTNAME##.Models/##PROJECTNAME##.Models.csproj
    // dotnet sln "Bookshop.sln" add "Bookshop.Engine\Bookshop.Engine.csproj"
    //  dotnet sln "GolfBreaks/GolfBreaks/GolfBreaks.sln" add "GolfBreaks/GolfBreaks.Engine/GolfBreaks.Engine.csproj"

    let cmdStr = "dotnet sln ";

    cmdStr = cmdStr + "\"" + _workflow.SolutionPath + "\"" + " add ";

    cmdStr = cmdStr + "\"" + projectItem["project-file-path"]  + "\"";

    runCommand(cmdStr);

}

function addReferences(projectItem) {
    if (projectItem["references"]=== undefined) {
        return;
    }

    projectItem["references"].forEach(projReference => {
        addReference(projectItem, projReference);
    });

}

function findProjectByName(projectName) {
    let projectObj = undefined;
    let totalProjects = _workflow.Projects.length - 1;

    for(let idx=0; idx < totalProjects; idx++) {
        if (_workflow.Projects[idx]["project-name"] === projectName) {
            projectObj = _workflow.Projects[idx];
            break;
        }
    }

    return projectObj;
}

function addReference(projectItem, projectReference) {
    let refProject = findProjectByName(projectReference);

    if (refProject === undefined) {
        return;
    }
    
    // dotnet add ##PROJECT PATH## reference ##DIRNAME####PROJECTNAME##.Engine/##PROJECTNAME##.Engine.csproj
    let cmdStr = "dotnet add ";

    cmdStr = cmdStr + "\"" + projectItem["project-file-path"]  + "\"" + " reference ";

    cmdStr = cmdStr + "\"" + refProject["project-file-path"] + "\"";

    runCommand(cmdStr);
}

function addEntityFrameworks(projectItem) {
    if (projectItem["ef-databases"] === undefined) {
        return;
    }

    projectItem["ef-databases"].forEach(efItem => {
        console.log("Log EF");
        createEF(projectItem, efItem);
    });

}

function createEF(projectItem, efItem) {
    // dotnet ef dbcontext scaffold "##DATABASE_CONNECTION##" Microsoft.EntityFrameworkCore.SqlServer -f --project "##DIRNAME####PROJECTNAME##.Engine/##PROJECTNAME##.Engine.csproj"

    let cmdStr = "dotnet ef dbcontext scaffold ";

    cmdStr = cmdStr + "\"" + efItem["database-connection"] + "\" ";

    cmdStr = cmdStr + "Microsoft.EntityFrameworkCore.SqlServer";

    cmdStr = cmdStr + " --project \"" + projectItem["project-file-path"] + "\"";

    runCommand(cmdStr);
}

