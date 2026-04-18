const router = require("express").Router();
const { savePayslip, getAllHistory } = require("../controllers/payslipController.js");

router.post("/save", savePayslip);
router.get("/history", getAllHistory);

module.exports = router;