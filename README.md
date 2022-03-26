# js-scaffolding
Javascript library to create Visual Studio Studio projects using Dotnet Cli commands.

This javascript library is a Work In Progress (WIP). Do not use for production! Have fun playing around with it.

## Basic commands

### scaffold

The command is 'scaffold'. This will create projects based off a template in a text file.

There is only one working template at the moment; "aspnet-core". It will generate Netcore App 3.1 project and add project references to the main website. Change "projectname" to your preference

```
npm run scaffold --templatename="aspnet-core" --projectname="Bookshop"
```

You can now create an ASP.net Core project with a database engine. It will scaffold a Entity Framework database. It uses version 5.0.15

```
npm run scaffold --templatename="aspnet-core-db" --projectname="Bookshop" --databaseconnection="data source=localhost\SQLEXPRESS2;initial catalog=Bookshop;user id=BookshopUser;password='Password100'"
```

### scafflow

The command is 'scafflow'. This will create projects based off a JSON file. It will generate DotNet Cli commands and then create projects from those commands.

There's a JSON file in examples/workflow1.json. More will be added in future.

```
 npm run scafflow --workflow="examples/Workflow1.json"
```

## Sequence of Scafflow

It will act on the following instructions from the JSON file in the following order

- Create Solution File
- Create Projects
- For each project, add any nuget packages if requested. It will then add the project to the Solution
- Check if project requires Entity Framework. If any EntityFramework database connection strings are found, it will scaffold new EF files.
- Once all projects are generated, it will scan all projects again if any references are required to be added to other projects. For example, using Separation of Concerns concept, you might want to add Models projects to a Service project.

### Example Files

There are a few examples files you can create. One creates a simple website with tailwinds added as a package, the other will create a website with multiple projects added as references to the solution. More examples will added.

```
SimpleTailWinds.json - Creates an empty website with Tailwind CSS added as a package

GolfBreaks - Creates a Visual Studio solution with multiple projects attached to it. It adds references and npm packages. It will also generate an EF database library. This version is not complete 

```


### JSON Fields
Fields you can use in JSON file

Top Level

```
["solution-name"] - Name of your solution file.

["directory-path"] - It will create a new directory and generate all projects inside this folder. Keeps your projects organised.

["dry-run"] - This will not run any Dotnet Cli commands. Use ["display-command"] to show commands on screen and ["export-to-file"] to save generated commands to file.

["display-command"] - This will show generated Dotnet Cli commands on screen.

["export-to-file"] - This will write generated Dotnet Cli commands to a file. Might help you if you prefer to run your DotNet Cli commands manually. Files are saved in timestamped text files.

["ignore"] - This will tell the process to skip the current step e.g. don't generate projects, don't execute anmy actions nor add any packages. This can be set at local level in projects, packages, references or actions.

["do-not-create-solution"] - This will instruct process not to create a solution file

["force-overwrite"] - This will add a "--force" suffix to all "dotnet new" commands. If at top level the "force-overwrite" is set, it will over-ride any "force-overwrite" commands at local/project level.

```

Local Level

```
"actions" - This will run any actions after the solution and projects are created. You might wish to use npm commands

"project-name" - Name of project. Bear in mind, if you need to add this project as a reference to other projects, please enscure spelling and case sensivity matches up to project names referred to in ["references"] fields.

"project-description" - Description of project. Not used by process. For information purposes only.

"references" - List of project names to be added to current project. This list will be used to search for generated project file paths. None are found, it won't add any refernce to project. 
```