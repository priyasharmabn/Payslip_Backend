const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");

const employee_create = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      designation,
      department,
      pan,
      dob,
      joiningDate,
      bankName,
      accountNo,
      ifsc,
      basicSalary,
      hra,
    } = req.body;

    // Validation
    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if email or ID already exists
    const existing = await Employee.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Employee already exists with given details" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      employeeId,
      designation,
      department,
      pan,
      dob,
      joiningDate,
      bankName,
      accountNo,
      ifsc,
      basicSalary,
      hra,
    });

    const createdEmployee = await newEmployee.save();

    console.log("creaded employee is :", createdEmployee);

    return res.status(201).json({
      message: "Employee registered successfully",
      employee: createdEmployee,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// Get all employees
const employee_all = async (req, res) => {
  try {
    const employees = await Employee.find();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      message: "Employee List fetched successfully",
      employeeList: employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
const employee_details = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee not found",
      employee: employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete employee
const employee_delete = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await Employee.findByIdAndDelete(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee Delete successfully",
      employee: employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  employee_all,
  employee_details,
  employee_create,
  employee_delete,
};
