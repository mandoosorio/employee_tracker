const mysql = require("mysql");
const inquirer = require("inquirer");
const Employee = require("./js/employee");
const Role = require("./js/role");
const Department = require("./js/department");


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
var allRoles;
var allEmployees;

function getDepts() { //WORKS
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
function getRoles() { //WORKS
    allRoles = [];
    var query = "SELECT id, title, salary, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            allRoles.push(res[i].title);
        }
    });
}
function getEmployees() { //WORKS
    allEmployees = [];
    var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
    query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
    
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          allEmployees.push(res[i].first_name + " " + res[i].last_name);
        }
    });
}
function start() { //WORKS
    getDepts();
    getManagers();
    getRoles();
    getEmployees();

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
          "View Utilized Budget",
          "Update Employee",
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
        } else if (answers.choices === "View Utilized Budget") {
            viewUtilizedBudget();
        } else if (answers.choices === "Update Employee") {
            updateEmployee();
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
        if (response.department === "") {
            console.log("Please fill in input.")
            start();
        } else {
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
        }
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
        if (response.title === "" || response.salary === "" || response.department === "") {
            console.log("Please fill out all inputs.");
            start();
        } else {
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
        }
    });
}
function addEmployee() { // WORKS ALRIGHT
    console.log("If Employee role ID does not exist, employee may not be added. Add role first before continuing.");
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
        },
        {
            type: "input",
            name: "role",
            message: "What is the employee's role ID?"
        },
        {
            type: "input",
            name: "manager",
            message: "Who is the employee's manager?"
        }
    ]).then(function(response) {
        if (response.firstName === "" || response.lastName === "" || response.role === "" || response.manager === "") {
            console.log("Please fill out all inputs.");
            start();
        } else {    
            var query = `INSERT INTO employee (first_name, last_name, role_id, manager_name)
            VALUES ("${response.firstName}", "${response.lastName}", ${response.role}, "${response.manager}")`;
            connection.query(query, function(err, res) {
                console.log("Employee added!"); //something to view object);
                start();
            });
        }
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
function updateEmployee() { //WORKS BEAUTIFULLY
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name:"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name:"
        },
        {
            type: "list",
            name: "action",
            message: "What data would you like to change?",
            choices: [
                "First Name",
                "Last Name",
                "Role",
                "Manager Name"
            ]
        }
    ]).then(function(answers) {
        var first;
        var last;
        var mgr;
        var role;
        var action;

        if (answers.action === "First Name") {
            inquirer.prompt(
                {
                    type: "input",
                    name: "first",
                    message: "Input updated first name:"
                }
            ).then(function(res) {
                action = "first_name";
                first = res.first;

                var query = "UPDATE Employee ";
                query += `SET ${action} = '${res.first}' `;
                query += `WHERE first_name = '${answers.firstName}' AND last_name = '${answers.lastName}';`;

                connection.query(query, function(err, res) {
                    console.log(`Employee's ${answers.action} has been updated.`);
                    start();
                });
            });
        } else if (answers.action === "Last Name") {
            inquirer.prompt(
                {
                    type: "input",
                    name: "last",
                    message: "Input updated last name:"
                }
            ).then(function(res) {
                action = "last_name";
                last = res.last;

                var query = "UPDATE Employee ";
                query += `SET ${action} = '${res.last}' `;
                query += `WHERE first_name = '${answers.firstName}' AND last_name = '${answers.lastName}';`;

                connection.query(query, function(err, res) {
                    console.log(`Employee's ${answers.action} has been updated.`);
                    start();
                });
            });
        } else if (answers.action === "Role") {
            inquirer.prompt(
                {
                    type: "input",
                    name: "newRole",
                    message: "Input updated role id:"
                }
            ).then(function(res) {
                action = "role_id";
                role = res.newRole;

                var query = "UPDATE Employee ";
                query += `SET ${action} = '${res.newRole}' `;
                query += `WHERE first_name = '${answers.firstName}' AND last_name = '${answers.lastName}';`;

                connection.query(query, function(err, res) {
                    console.log(`Employee's ${answers.action} has been updated.`);
                    start();
                });
            });
        } else if (answers.action === "Manager Name") {
            inquirer.prompt(
                {
                    type: "input",
                    name: "newManager",
                    message: "Input updated manager name:"
                }
            ).then(function(res) {
                action = "manager_name";
                mgr = res.newManger;

                var query = "UPDATE Employee ";
                query += `SET ${action} = '${res.newManager}' `;
                query += `WHERE first_name = '${answers.firstName}' AND last_name = '${answers.lastName}';`;

                connection.query(query, function(err, res) {
                    console.log(`Employee's ${answers.action} has been updated.`);
                    start();
                });
            });
        }
    });
}
function removeDepartment() { //WORKS BEAUTIFULLY
    console.log("Departments", departments);
    inquirer.prompt(
        {
            type: "input",
            name: "deptName",
            message: "Input department name to be removed:"
        }
    ).then(function(res) {
        query = `DELETE FROM department WHERE department_name = '${res.deptName}';`;

        connection.query(query, function(err, res) {
            console.log(`Department removed.`);
            start();
        });
    });
}
function removeRole() { //WORKS DANGEROUSLY
    console.log("Roles", allRoles);
    inquirer.prompt(
        {
            type: "input",
            name: "roleName",
            message: "Input role to be removed:\n(WARNING - Removing a role that is currently assigned to an existing employee will remove the employee's data)"
        }
    ).then(function(res) {
        query = `DELETE FROM employee_role WHERE title = '${res.roleName}';`;

        connection.query(query, function(err, res) {
            console.log(`Role removed.`);
            start();
        });
    });
}
function removeEmployee() { //WORKS BEAUTIFULLY
    console.log("Employees", allEmployees);
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Input employee's first name:"
        },
        {
            type: "input",
            name: "lastName",
            message: "Input employee's last name:"
        }
    ]).then(function(res) {
        query = `DELETE FROM employee WHERE first_name = '${res.firstName}' AND last_name = '${res.lastName}';`;

        connection.query(query, function(err, res) {
            console.log(`Employee removed.`);
            start();
        });
    });
}
function viewUtilizedBudget() { //WORKS BEAUTIFULLY
    var salaries = 0;

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
            for (var i = 0; i < res.length; i++) {
               salaries += res[i].salary;
            }
            console.log("Salary Total: ", salaries);
            start();
        });
    });
}