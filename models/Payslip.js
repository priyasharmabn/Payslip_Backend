const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now },

  // Save the original payload
  company: {
    name: String,
    address: String,
    city: String,
    country: String,
    logo: String,
  },
  employee: {
    empId: String,
    name: String,
    designation: String,
    department: String,
    doj: Date,
    dob: Date,
    bankName: String,
    accountNumber: String,
    ifsc: String,
    pan: String,
    paidDays: Number,
    lopDays: Number,
    payPeriod: Date,
    payDate: Date,
  },
  earnings: { type: Object },    // Store dynamic earnings
  deductions: { type: Object },  // Store dynamic deductions
  gross: Number,
  totalDeduction: Number,
  netPay: Number,
});

module.exports = mongoose.model("Payslip", payslipSchema);

