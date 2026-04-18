const app = require("express");
const pdfRoutes = app.Router();
const { generatePdf, generateInvoice } = require("../controllers/pdfController");
const { getAllHistory, getPayslipById, deletePayslipById } = require("../controllers/payslipController");

pdfRoutes.post("/generate-pdf", generatePdf);

pdfRoutes.post("/generate-invoice-pdf", generateInvoice);

pdfRoutes.get("/history", getAllHistory);

pdfRoutes.get("/:id", getPayslipById);

pdfRoutes.delete("/:id", deletePayslipById);

module.exports = pdfRoutes;
