CREATE DATABASE to_do_app;

Create TABLE lists (
	id SERIAL PRIMARY KEY,
	list_name VARCHAR(35),
	list_background_color VARCHAR(35));
	
INSERT INTO lists (list_name ,list_background_color)
	VALUES	('groceries','red'),
			('school','orange'),
			('work','yellow'),
			('family','green'),
			('finances','blue'),
			('health','indigo'),
			('hobbies','violet');

Create TABLE groceries (
	id SERIAL PRIMARY KEY,
	item VARCHAR(35),
	quantity INTEGER);
	
INSERT INTO groceries (item,quantity)
	VALUES	('apples',3),
			('bananas',10),
			('crabs',4),
			('dog food',1);
			
Create TABLE school (
	id SERIAL PRIMARY KEY,
	due_date DATE,
	assignments VARCHAR(35),
	notes VARCHAR(300));
	
INSERT INTO school (due_date,assignments,notes)
	VALUES	('2017-11-27','TODO App','Weekend Challenge 3'),
			('2017-11-28','LinkedIn Part1','Update Contact Info, Summary, Experience, Education'),
			('2017-11-29','Classroom Norms','Preparation for Class discussion');
			
Create TABLE work (
	id SERIAL PRIMARY KEY,
	due_date DATE,
	tasks VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO work (due_date,tasks,notes) VALUES	
	('2017-11-27','Crush enemies','Very Important'),
	('2017-11-28','See enemies driven before me','Use cavalry'),
	('2017-11-29','Hear the lamentations of their women!','Conan the Barbarian is a good movie');