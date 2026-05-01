const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const numberToWords = require("number-to-words");
const InvoiceCounter = require("./models/InvoiceCounter.js");

const employeeRoutes = require("./routes/employeeRoutes.js");
const pdfRoutes = require("./routes/pdfRoutes.js");
const payslipRoutes = require("./routes/payslipRoutes.js");

dotenv.config();
console.log("Mongo URI:", process.env.DB_CONNECT);

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "https://payslip-frontend-6pw3.onrender.com",
    // origin: "http://localhost:3030",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const mongoURI = process.env.DB_CONNECT;
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Force IPv4
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ Error connecting to MongoDB Atlas:", err));

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api", pdfRoutes);
app.get("/api/payslip", payslipRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is up and running on PORT ${PORT}`);
  console.log("DB Has Been Connectd!!!");
});





























// app.post("/generate-pdf", async (req, res) => {
//   try {
//     const {
//       company,
//       employee,
//       earnings,
//       deductions,
//       gross,
//       totalDeduction,
//       netPay,
//     } = req.body;

//     // Dynamic HTML for earnings
//     const earningsHTML = Object.values(earnings)
//       .map((e) => {
//         if (!e.label || Number(e.amount) === 0) return "";
//         return `<div class="flex justify-between"><p>${
//           e.label
//         }</p><p>Rs.${Number(e.amount).toFixed(2)}</p></div>`;
//       })
//       .join("");

//     // Dynamic HTML for deductions
//     const deductionsHTML = Object.values(deductions)
//       .map((d) => {
//         if (!d.label || Number(d.amount) === 0) return "";
//         return `<div class="flex justify-between"><p>${
//           d.label
//         }</p><p>Rs.${Number(d.amount).toFixed(2)}</p></div>`;
//       })
//       .join("");

//     const data = {
//       COMPANY_NAME: company.name,
//       MONTH: new Date(employee.payPeriod).toLocaleString("default", {
//         month: "long",
//         year: "numeric",
//       }),
//       PAY_DATE: new Date(employee.payDate).toLocaleDateString("en-IN"),
//       EMP_ID: employee.empId,
//       NAME: employee.name,
//       DESIGNATION: employee?.designation,
//       DOJ: new Date(employee.doj).toLocaleDateString("en-IN"),
//       DEPARTMENT: employee?.department,
//       LOCATION: company.city,
//       ADDRESS: company.address,
//       BANK_NAME: employee.bankName || "",
//       ACCOUNT_NO: employee.accountNumber,
//       WORK_DAYS: employee.paidDays,
//       LOP_DAYS: employee.lopDays || 0,
//       PAN: employee.pan || "",
//       DOB: new Date(employee.dob).toLocaleDateString("en-IN"),
//       IFSC: employee.ifsc || "",
//       GROSS_EARNINGS: Number(gross).toFixed(2),
//       TOTAL_DEDUCTIONS: Number(totalDeduction).toFixed(2),
//       NET_SALARY: Number(netPay).toFixed(2),
//       NET_SALARY_IN_WORDS:
//         numberToWords
//           .toWords(Number(netPay))
//           .replace(/\b\w/g, (l) => l.toUpperCase()) + " Only",
//       EARNINGS_DYNAMIC: earningsHTML,
//       DEDUCTIONS_DYNAMIC: deductionsHTML,
//     };

//     const logoPath = path.join(__dirname, "public", "logobnt.png"); // adjust path if needed
//     let logoBase64 = "";
//     if (fs.existsSync(logoPath)) {
//       console.log("logo is present");
//       const imageBuffer = fs.readFileSync(logoPath);
//       const imageType = path.extname(logoPath).replace(".", ""); // e.g. "png"
//       logoBase64 = `data:image/${imageType};base64,${imageBuffer.toString(
//         "base64"
//       )}`;
//     }
//     data.LOGO = logoBase64;

//     let html = fs.readFileSync(
//       path.join(__dirname, "views", "payslipTemplate.html"),
//       "utf8"
//     );

//     for (const key in data) {
//       // const regex = new RegExp(`{{${key}}}`, "g");
//       const regex = new RegExp(`{{${key}}}`, "g");

//       html = html.replace(regex, data[key]);
//     }

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": 'attachment; filename="payslip.pdf"',
//     });
//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error("PDF error:", err);
//     res.status(500).send("Failed to generate PDF");
//   }
// });

// app.post("/generate-invoice-pdf", async (req, res) => {
//   try {
//     // Generate invoice number dynamically
//     const generateInvoiceNumber = async () => {
//       const year = new Date().getFullYear().toString();
//       const counter = await InvoiceCounter.findOneAndUpdate(
//         { year },
//         { $inc: { number: 1 } },
//         { upsert: true, new: true }
//       );
//       return `${year}-${counter.number}`;
//     };

//     const invoiceNo = await generateInvoiceNumber();

//     // Extract remaining fields from body
//     const {
//       from,
//       to,
//       items,
//       subtotal,
//       igst,
//       tds,
//       tdsAmount,
//       grandTotal,
//       invoiceDate,
//       dueDate,
//     } = req.body;

//     // Read and encode logo
//     const logoPath = path.join(__dirname, "public", "logobnt.png");
//     let logoBase64 = "";
//     if (fs.existsSync(logoPath)) {
//       console.log("Logo find");
//       const imageBuffer = fs.readFileSync(logoPath);
//       const imageType = path.extname(logoPath).replace(".", "");
//       logoBase64 = `data:image/${imageType};base64,${imageBuffer.toString(
//         "base64"
//       )}`;
//     }

//     const signaturePath = path.join(__dirname, "public", "signature.png");
//     let signatureBase64 = "";
//     if (fs.existsSync(signaturePath)) {
//       console.log("Signature find");
//       const imageBuffer = fs.readFileSync(signaturePath);
//       const imageType = path.extname(signaturePath).replace(".", ""); // "png"
//       signatureBase64 = `data:image/${imageType};base64,${imageBuffer.toString(
//         "base64"
//       )}`;
//     }

//     // Build dynamic HTML rows for items
//     const itemsHTML = items
//       .map((item, idx) => {
//         return `
//           <tr class="${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}">
//             <td class="px-3 py-2 border-b border-gray-100">${idx + 1}</td>
//             <td class="px-3 py-2 border-b border-gray-100">${item.name}</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-center">${
//               item.gstRate
//             }%</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-center">${
//               item.quantity
//             }</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-right">₹${item.rate.toFixed(
//               2
//             )}</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-right">₹${item.amount.toFixed(
//               2
//             )}</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-right">₹${item.igst.toFixed(
//               2
//             )}</td>
//             <td class="px-3 py-2 border-b border-gray-100 text-right">₹${item.total.toFixed(
//               2
//             )}</td>
//           </tr>
//           ${
//             item.description
//               ? `<tr class="bg-yellow-50 text-[12px]"><td colspan="8" class="px-4 py-2 text-gray-700 italic border-b border-gray-200"><strong>Description:</strong> ${item.description}</td></tr>`
//               : ""
//           }
//         `;
//       })
//       .join("");

//     // Read HTML template
//     const htmlPath = path.join(__dirname, "views", "invoiceTemplate.html");
//     let html = fs.readFileSync(htmlPath, "utf8");

//     // Define dynamic placeholders
//     const placeholders = {
//       LOGO: logoBase64,
//       SIGNATURE_IMAGE: signatureBase64,
//       FROM_COMPANY: from.companyName,
//       FROM_ADDRESS: from.address,
//       FROM_GSTIN: from.gstin,
//       FROM_PAN: from.pan,
//       FROM_EMAIL: from.email,
//       FROM_PHONE: from.phone,
//       TO_COMPANY: to.companyName,
//       TO_ADDRESS: to.address,
//       TO_GSTIN: to.gstin,
//       TO_PAN: to.pan,
//       TO_EMAIL: to.email || "-",
//       TO_PHONE: to.phone || "-",
//       INVOICE_NO: invoiceNo,
//       INVOICE_DATE: invoiceDate,
//       DUE_DATE: dueDate,
//       ITEMS_DYNAMIC: itemsHTML,
//       SUBTOTAL: subtotal.toFixed(2),
//       IGST: igst.toFixed(2),
//       TDS: tds,
//       TDS_AMOUNT: tdsAmount.toFixed(2),
//       GRAND_TOTAL: grandTotal.toFixed(2),
//     };

//     // Replace placeholders in template
//     for (const key in placeholders) {
//       html = html.replace(new RegExp(`{{${key}}}`, "g"), placeholders[key]);
//     }

//     // Generate PDF with Puppeteer
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });
//     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
//     await browser.close();

//     // Send response
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename=invoice-${invoiceNo}.pdf`,
//     });

//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error("Invoice PDF Error:", err.message);
//     res.status(500).send("Error generating invoice PDF");
//   }
// });