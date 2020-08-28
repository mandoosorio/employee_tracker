const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
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
function start() {
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
function viewAllEmployees() { //WORKS
    var query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].first_name, res[i].last_name, res[i].role_id);
        }
    });
}
function viewAllEmployeesByDepartment() { //WORKS
    inquirer.prompt(
        {
            type: "input",
            name: "department",
            message: "Enter department name:"
        }
    ).then(function(answer) {
        var query = `SELECT id, department_name FROM department`;
        var deptID;
        connection.query(query, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (res[i].department_name == answer.department) {
                    console.log(res[i].id, res[i].department_name);
                    deptID = res[i].id;
                }
            }
        });

        var query2 = `SELECT id, title, department_id FROM employee_role`;
        var roleID = [];
        connection.query(query2, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (res[i].department_id == deptID) {
                    console.log(res[i].id, res[i].title);
                    roleID.push(res[i].id);
                }
            }
        });

        var query3 = `SELECT id, first_name, last_name, role_id FROM employee`;
        connection.query(query3, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (roleID.includes(res[i].role_id) == true) {
                    console.log("final results", res[i].id, res[i].first_name, res[i].last_name);
                }
            }
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