const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./employee");
const Role = require("./role");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "clio2345",
    database: "employeeDB"
});
connection.connect(function(err) {
    if (err) {
        throw err;
    }
    start();
});

var departments;

function getDepts() {
    departments = [];
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].id + ". " + res[i].department_name);
        }
    });
}

function start() {
    getDepts();
    console.log("Welcome to the Employee Manager Application");
    inquirer.prompt({
      name: "choices",
      type: "list",
      message: "What would you like to do?",
      choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Update Employee Role",
          "Update Employee Manager",
          "Remove Department",
          "Remove Role",
          "Remove Employee",
          "EXIT"
        ]
    }).then(function(answers) {
        console.log("You Chose:", answers.choices);
        if (answers.choices === "Add Department") {
            addDepartment();
        } else if (answers.choices === "Add Role") {
            addRole();
        } else if (answers.choices === "Add Employee") {
            addEmployee();
        } else if (answers.choices === "View All Departments") {
            viewAllDepartments();
        } else if (answers.choices === "View All Roles") {
            viewAllRoles();
        } else if (answers.choices === "View All Employees") {
            viewAllEmployees();
        } else if (answers.choices === "View All Employees By Department") {
            viewAllEmployeesByDepartment();
        } else if (answers.choices === "View All Employees By Manager") {
            viewAllEmployeesByManager();
        } else if (answers.choices === "Update Employee Role") {
            updateEmployeeRole();
        } else if (answers.choices === "Update Employee Manager") {
            updateEmployeeManager();
        } else if (answers.choices === "Remove Department") {
            removeDepartment();
        } else if (answers.choices === "Remove Role") {
            removeRole();
        } else if (answers.choices === "Remove Employee") {
            removeEmployee();
        } else {
            connection.end();
        }
    });
}
function addDepartment() { //WORKS
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Enter department name:"
        }
    ]).then(function(response) {
        var query = `INSERT INTO department (department_name)
        VALUES ("${response.department}");`;
        connection.query(query, function(err, res) {
            console.log("Department added!"); //something to view department;
            start();
        });
    })
}
function addRole() { //WORKS
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Inpute role title:"
        },
        {
            type: "input",
            name: "salary",
            message: "Input role salary:"
        },
        {
            type: "input",
            name: "department",
            message: "Input department ID:"
        }
    ]).then(function(response) {
        var query = `INSERT INTO employee_role (title, salary, department_id)
        VALUES ("${response.title}", ${response.salary}, ${response.department});`;
        connection.query(query, function(err, res) {
            console.log("Role added!"); //something to view role;
        });
    });
}
function addEmployee() { //WORKS
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employees first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employees last name?",
        },
        {
            name: "role",
            type: "list",
            message: "What is the employees role?",
            choices: [
                "Sales",
                "Engineering",
                "Legal",
                "Finance",
                "Human Resources"
            ]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employees manager?",
            choices: [
                "Joe",
                "Mamma"
            ]
        }
    ]).then(function(response) {
        var query = `INSERT INTO employee (first_name, last_name, employee_role, department_id, manager_name)\n
        VALUES ("${response.firstName}", "${response.lastName}", "${response.role}", 4567, "${response.manager}")`;
        connection.query(query, function(err, res) {
            console.log("Employee added!"); //something to view object);
        });
    });
}
function viewAllDepartments() { //WORKS
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].id, res[i].department_name);
        }
        start();
    });
}
function viewAllRoles() { //WORKS
    var query = "SELECT title, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].title, res[i].department_id);
        }
    });
}
function viewAllEmployees() { //WORKS BEAUTIFULLY
    var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
    query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
    query += "ORDER BY employee_role.id";
    
    connection.query(query, function(err, res) {
        var employees = [];
        for (var i = 0; i < res.length; i++) {
          const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
          employees.push(employee);
        }
        console.table(employees);
        start();
    });
}
function viewAllEmployeesByDepartment() { //WORKS BEAUTIFULLY
    console.log("Departments", departments);
    inquirer.prompt(
        {
            type: "input",
            name: "department",
            message: "Enter department #:"
        }
    ).then(function(answer) {
        var query = "SELECT department.id, department.department_name, employee_role.id, employee_role.title, employee_role.department_id, employee_role.salary, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
        query += "FROM department INNER JOIN employee_role ON (department.id = employee_role.department_id) ";
        query += "INNER JOIN employee ON (employee_role.id = employee.role_id) ";
        query += "WHERE (department.id = ? AND employee_role.department_id = ?) ";
        query += "ORDER BY department.id";

        connection.query(query, [answer.department, answer.department], function(err, res) {
            var employees = [];
            for (var i = 0; i < res.length; i++) {
              const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
              employees.push(employee);
            }
            console.table(employees);
            start();
        });
    });
}
function viewAllEmployeesByManager() {
}
function updateEmployeeRole() {
}
function updateEmployeeManager() {
}
function removeDepartment() {}
function removeRole() {
}
function removeEmployee() {
}