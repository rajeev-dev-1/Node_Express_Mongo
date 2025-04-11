
/*const data = require('./../model/data.json');

const getAllEmployees = (req, res)=>{
    res.json(data);
}

const addAnEmployee = (req, res)=>{
    res.json({
            'firstName': req.body.firstName,
            'lastName': req.body.lastName
    });
}

const deleteEmployee = (req, res)=>{
    res.json({
        'deleted ID': req.body.id
    });
}

const updateEmpoyee = (req, res)=>{
    res.json({
        'updated name':req.body.firstName
    })
}

const getEmployee = (req, res)=>{
    res.json({
        'read Id': req.params.id
    })
}


module.exports = {
    getAllEmployees,
    addAnEmployee,
    deleteEmployee,
    updateEmpoyee,
    getEmployee
}*/

//above is my code below one is copied from instructor's resource

const Employee = require('./../model/Employee');
const mongoose = require('mongoose');

let data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find().exec();
    res.json(employees);
}

const addAnEmployee = async (req, res) => {

    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({"message": "first name or last name are required"});
    }

    const employee = new Employee({firstname: req.body.firstname, lastname: req.body.lastname});
    const result = await employee.save();
    console.log(`new employee added ${result}`);
    res.status(201).json(result);
}

const updateEmpoyee = async (req, res) => {
  
    if (!req?.body?.id) {
        return res.status(400).json({ "message": `Employee ID is required.` });
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if(!employee){
        return res.status(204).json({ "message": `Employee ID ${req.body.id} not found` });
    }

    if (req?.body?.firstName) employee.firstname = req.body.firstName;
    if (req?.body?.lastName) employee.lastname = req.body.lastName;

    const result = await employee.save();
    console.log(`Employee updated: ${result}`);

    return res.status(200).json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": `Employee ID is required.` });
    }
    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const result = await employee.deleteOne();
    return res.status(204).json(result);
}

const getEmployee = async (req, res) => {

    if(!req?.params?.id){
        return res.status(400).json({"message": `Id is required`});
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({"message": `Invalid Id`});
    }
    
    const employee = await Employee.findOne({_id: req.params.id}).exec();
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }    
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    addAnEmployee,
    updateEmpoyee,
    deleteEmployee,
    getEmployee
}