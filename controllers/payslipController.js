const Payslip = require("../models/Payslip");
const path = require("path");
const fs = require("fs");

const savePayslip1 = async (pdfBuffer, data) => {
  const fileName = `payslip_${Date.now()}.pdf`;
  // const filePath = path.join(__dirname, "..", "payslips", fileName);
  const filePath = path.join(__dirname, "..", "uploads", "pdfs", fileName);

  // Save file locally
  fs.writeFileSync(filePath, pdfBuffer);

  // Save metadata + payload to DB
  const payslip = new Payslip({
    fileName,
    filePath,
    company: data.company,
    employee: data.employee,
    earnings: data.earnings,
    deductions: data.deductions,
    gross: data.gross,
    totalDeduction: data.totalDeduction,
    netPay: data.netPay,
  });

  await payslip.save();
  return payslip;
}

const savePayslip = async (pdfBuffer, data) => {
  try {
    // Unique filename
    const fileName = `payslip_${data?.employee?.name+"_"+Date.now()}.pdf`;

    // Absolute path for saving the file
    const savePath = path.join(__dirname, "..", "uploads", "pdfs", fileName);

    // Ensure uploads/pdfs exists
    const dirPath = path.join(__dirname, "..", "uploads", "pdfs");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Save file
    fs.writeFileSync(savePath, pdfBuffer);

    // Save metadata + payload to DB
    const payslip = new Payslip({
      fileName,
      filePath: `uploads/pdfs/${fileName}`,
      company: data.company,
      employee: data.employee,
      earnings: data.earnings,
      deductions: data.deductions,
      gross: data.gross,
      totalDeduction: data.totalDeduction,
      netPay: data.netPay,
    });

    await payslip.save();

    console.log("Payslip saved:", fileName);
    return payslip;
  } catch (err) {
    console.error("Error saving payslip:", err);
    throw err;
  }
};

const getAllHistory = async (req, res) => {
  console.log("Fetching payslip history");
  try {
    const history = await Payslip.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayslipById = async (req, res) => {
  try {
    const { id } = req.params;
    const payslip = await Payslip.findById(id);

    if (!payslip) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    res.json(payslip);
  } catch (error) {
    console.error("Error fetching payslip:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePayslipById = async (req, res) => {
  console.log("Deleting payslip");
  try {
    const { id } = req.params;
    const isDeleted = await Payslip.findByIdAndDelete(id);
    if (isDeleted) {
      console.log("Payslip deleted successfully");
      return res.json({ message: "Payslip deleted successfully" });
    } else {
      return res.status(404).json({ message: "Payslip not found" });
    }
  } catch (error) {
    console.error("Error deleting payslip:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { savePayslip, getAllHistory, getPayslipById, deletePayslipById };
