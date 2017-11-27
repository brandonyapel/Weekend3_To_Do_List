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
	completion_status VARCHAR(1),
	item VARCHAR(35),
	quantity INTEGER);
	
INSERT INTO groceries (completion_status,item,quantity)
	VALUES	('n','apples',3),
			('n','bananas',10),
			('n','crabs',4),
			('y','dog food',1);
			
Create TABLE school (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	assignments VARCHAR(35),
	notes VARCHAR(300));
	
INSERT INTO school (completion_status,due_date,assignments,notes)
	VALUES	('n','2017-11-27','TODO App','Weekend Challenge 3'),
			('n','2017-11-28','LinkedIn Part1','Update Contact Info, Summary, Experience, Education'),
			('n','2017-11-29','Classroom Norms','Preparation for Class discussion');
			
Create TABLE work (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	tasks VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO work (completion_status,due_date,tasks,notes) VALUES	
	('y','2017-11-27','Crush enemies','Very Important'),
	('n','2017-11-28','See enemies driven before me','Use cavalry'),
	('n','2017-11-29','Hear the lamentations of their women!','Conan the Barbarian is a good movie');
	
Create TABLE family (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	chores VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO family (completion_status,due_date,chores,notes) VALUES	
	('b','2017-11-27','buy christmas presents','mom,dad,sister1,sister2,brother in law'),
	('n','2017-11-28','do laundry','use Tri-Sodium-Phosphate'),
	('n','2017-11-29','call mom','find out plans for Christmas');
	
Create TABLE finances (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	task VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO finances (completion_status,due_date,task,notes) VALUES	
	('y','2017-11-27','balance checkbook','look for outstanding checks'),
	('n','2017-11-28','corner the market on chewing gum','orbit,extra,double bubble'),
	('n','2017-11-29','pass go','collect 200 dollars');

Create TABLE health (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	task VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO health (completion_status,due_date,task,notes) VALUES	
	('y','2017-11-27','walk 5000 miles','dadada'),
	('n','2017-11-28','start see-food diet','old country buffet'),
	('n','2017-11-29','10 pushups','90 degree');	
	
Create TABLE hobbies (
	id SERIAL PRIMARY KEY,
	completion_status VARCHAR(1),
	due_date DATE,
	task VARCHAR(100),
	notes VARCHAR(300));

INSERT INTO hobbies (completion_status,due_date,task,notes) VALUES	
	('y','2017-11-27','buy stuff','rubber gloves, chain saw, bleach'),
	('n','2017-11-28','dig up garden','atleast 5 feet deep'),
	('n','2017-11-29','plant the garden','tomatos, peppers');