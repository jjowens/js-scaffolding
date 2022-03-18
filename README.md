# js-scaffolding
Javascript library to create Visual Studio Studio projects using Dotnet Cli commands.

This javascript library is a Work In Prpogress (WIP). Do not use for production! Have fun playing around with it.

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

Fields you can use in JSON file

Top Level

```
["dry-run"] - This will not run any Dotnet Cli commands. Use ["display-commands"] to show commands on screen

["show-command"] - This will show generated Dotnet Cli commands on screen.

["export-to-file"] - This will write generated Dotnet Cli commands to a file. 

```