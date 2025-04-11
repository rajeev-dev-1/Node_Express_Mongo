const verifyRoles = (...allowedRoles)=>{
    return (req, res, next)=>{
        const roles = req.roles;
        const rolesArr = [...allowedRoles];
        //Following is testing for atleast one role present in request
        const result = roles.map(role => rolesArr.includes(role)).find(result => result === true);
        if(!result){
            return res.sendStatus(401);//unauthorized access
        }
        next();
    }
}
module.exports = verifyRoles