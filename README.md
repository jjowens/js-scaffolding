# js-scaffolding
Javascript library to create Visual Studio Studio projects using Dotnet Cli commands.

This is a very rough draft. Do not use for production!

## Basic commands

There are only two working templates at the moment; "aspnet-core" and "aspnet-core-db". It will generate Netcore App 3.1 project and add project references to the main website. Change "projectname" to your preference

```
npm run scaffold --templatename="aspnet-core" --projectname="Bookshop"
```

You can now create an ASP.net Core project with a database engine. It will scaffold a Entity Framework database based on your database connection string. It uses version 5.0.15

```
npm run scaffold --templatename="aspnet-core-db" --projectname="Bookshop" --databaseconnection="data source=localhost\SQLEXPRESS2;initial catalog=Bookshop;user id=BookshopUser;password='Password100'"
```
