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

SELECT * FROM lists ORDER BY id;

Create TABLE groceries (
	id SERIAL PRIMARY KEY,
	item VARCHAR(35),
	quantity INTEGER);
	
INSERT INTO groceries (item,quantity)
	VALUES	('apples',3),
			('bananas',10),
			('crabs',4),
			('dog food',1);