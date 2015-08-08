Todo
====

Todo lists managing tool using node.js on the server side

## Installing

### Node modules

This project relies on node.js to be executed, and a few modules available through npm.
To get started with it, just run the following lines :

```
git clone https://github.com/juchi/Todo.git todo
cd todo/
npm install
```

### Database

You need a MySQL database with a few tables that you can create with this SQL command :

```
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `timezone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `position` int(11) NOT NULL DEFAULT '0',
  `timezone` int(11) NOT NULL,
  `deadline` date,
  `created_at` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timezone` (`timezone`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`timezone`) REFERENCES `timezone` (`id`),
  CONSTRAINT `task_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Database access details can be modified in the file models/storage.js.

## Running

Just change the current directory to the project's directory and run :

```
node server.js
```
