// employee.js

const router = require('express').Router();
const employeeController = require('../controllers/employeeController');

router.post('/', employeeController.employee_create);
router.get('/:id', employeeController.employee_details);
router.get('/', employeeController.employee_all);
router.delete('/:id', employeeController.employee_delete);

module.exports = router;
