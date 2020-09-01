class Employee {
    constructor(id, firstName, lastName, role, salary, managerID) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.role = role;
      this.salary = salary;
      this.mangerID = managerID;
    }
  }
  
  module.exports = Employee;