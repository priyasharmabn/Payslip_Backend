const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, unique: true },
  designation: String,
  department: String,
  pan: String,
  dob: String,
  joiningDate: String,
  bankName: String,
  accountNo: String,
  ifsc: String,
  basicSalary: Number,
  hra: Number,
});

module.exports = mongoose.model("Employee", employeeSchema);
