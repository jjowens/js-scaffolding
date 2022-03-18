const scaffoldjs = require("./lib/scaffold");
const scafflow = require("./lib/scafflow");

const action = process.env.npm_config_action;

console.log("Action '" + action + "'");

if (action == "scafflow") {
	var obj = new Object();
	obj.Workflow = process.env.npm_config_workflow;

	scafflow.run(obj);
} else {
	var obj = new Object();
	obj.templateName = process.env.npm_config_templatename;
	obj.projectName = process.env.npm_config_projectname;
	obj.databaseConnection = process.env.npm_config_databaseconnection;

	scaffoldjs.run(obj);
}