const express = require('express');
const router = express.Router();

const  employeesController = require('./../../controllers/employeesController');
const  verifyJWT = require('./../../middleware/verifyJWT');
const verifyRoles = require('./../../middleware/verifyRoles');
const userRoles = require('./../../config/roles_list');

router.route('/')
    //.get(verifyJWT, employeesController.getAllEmployees) this is one way i.e. protect one specific route 
    //other way is mentioned in server.js

    //w.r.t roles we are allowing all users who are atleast authenticated for getAllEmployees
    //for others endpoints, there is validation first as below.
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(userRoles.Admin, userRoles.Editor), 
                    employeesController.addAnEmployee)
    .put(verifyRoles(userRoles.Admin, userRoles.Editor), 
                    employeesController.updateEmpoyee)
    .delete(verifyRoles(userRoles.Admin), 
                    employeesController.deleteEmployee);

router.route('/:id')
        .get(employeesController.getEmployee);

        
module.exports = router;