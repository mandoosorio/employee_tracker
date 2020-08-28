DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;
USE employeeDB;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NULL NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    PRIMARY KEY (id)
);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);
INSERT INTO department (department_name)
VALUES ("Sales"), ("Engineering"), ("Legal"), ("Finance"), ("Human Resources");
INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Lead", 75000, 1), ("Sales Representative", 50000, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Armando", "Osorio", 1, 4444), ("Potato", "Head", 2, 6666);

SELECT * FROM department;
SELECT * FROM employee_role;
SELECT * FROM employee;