const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./employee");
const Role = require("./role");
const Department = require("./department");
const Manager = require("./manager");


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
var managers;

function getDepts() {
    departments = [];
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].id + ". " + res[i].department_name);
        }
    });
}
function getManagers() { //WORKS ALRIGHT
    managers = [];
    var query = "SELECT manager_name FROM employee";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            if (managers.includes(res[i].manager_name) === false) {
                managers.push(res[i].manager_name);
            }
        }
    });
}
function start() {
    getDepts();
    getManagers();
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
function addDepartment() { //WORKS BEAUTIFULLY
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
            console.log("Department added!");
        })

        var query2 = "SELECT id, department_name FROM department";
        connection.query(query2, function(err, res) {
            var depts = [];
            for (i = 0; i < res.length; i++) {
                const department = new Department(res[i].id, res[i].department_name);
                depts.push(department);
            }
            console.table(depts);
            start();
        });
    })
}
function addRole() { //WORKS BEAUTIFULLY
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
            console.log("Role added!");
        });

        var query2 = "SELECT id, title, salary, department_id FROM employee_role";
        connection.query(query2, function(err, res) {
            var roles = [];
            for (i = 0; i < res.length; i++) {
                const role = new Role(res[i].id, res[i].title, res[i].salary, res[i].department_id);
                roles.push(role);
            }
            console.table(roles);
            start();
        });
    });
}
function addEmployee() { // WORKS ALRIGHT
    console.log("If Employee role ID does not exist, employee may not be added. Add role first before continuing.");
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "role",
            type: "input",
            message: "What is the employee's role ID?"
        },
        {
            name: "manager",
            type: "input",
            message: "Who is the employee's manager?"
        }
    ]).then(function(response) {
        var query = `INSERT INTO employee (first_name, last_name, role_id, manager_name)
        VALUES ("${response.firstName}", "${response.lastName}", ${response.role}, "${response.manager}")`;
        connection.query(query, function(err, res) {
            console.log("Employee added!"); //something to view object);
            start();
        });
    });
}
function viewAllDepartments() { //WORKS BEAUTIFULLY
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        var depts = [];
        for (i = 0; i < res.length; i++) {
            const department = new Department(res[i].id, res[i].department_name);
            depts.push(department);
        }
        console.table(depts);
        start();
    });
}
function viewAllRoles() { //WORKS BEAUTIFULLY
    var query = "SELECT id, title, salary, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        var roles = [];
        for (i = 0; i < res.length; i++) {
            const role = new Role(res[i].id, res[i].title, res[i].salary, res[i].department_id);
            roles.push(role);
        }
        console.table(roles);
        start();
    });
}
function viewAllEmployees() { //WORKS BEAUTIFULLY
    var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
    query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
    
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
function viewAllEmployeesByManager() { //WORKS BEAUTIFULLY
    console.log("Managers", managers);
    inquirer.prompt(
        {
            type: "input",
            name: "managerName",
            message: "Enter manager name:"
        }
    ).then(function(answer) {
        var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
        query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
        
        connection.query(query, function(err, res) {
            var employees = [];
            for (var i = 0; i < res.length; i++) {
                if (res[i].manager_name == answer.managerName) {
                    const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
                    employees.push(employee);
                }
            }
            console.table(employees);
            start();
        });
    });
}
function updateEmployeeRole() {
}
function updateEmployeeManager() {
}
function removeDepartment() {
}
function removeRole() {
}
function removeEmployee() {
}