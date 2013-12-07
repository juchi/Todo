Todo
====

Todo lists managing tool using node.js on the server side

## Installing

### Node modules

This project relies on node.js to be executed, and a few modules available on npm.
To get started with it, clone the repository and run the following lines :

```
npm install express ejs mysql
```

### Database

You need a MySQL database with a table that you can create with this SQL command :

```
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `position` int(11) NOT NULL DEFAULT '0',
  `timezone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

Database access details can be modified in the file storage.js.

## Running

Just change the current directory to the project's directory and run :

```
node server.js
```
