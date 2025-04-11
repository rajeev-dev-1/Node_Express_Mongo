const jwt = require('jsonwebtoken');



const something = ()=>{
    console.log('called from verify');
}

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader){
         return res.sendStatus(401);
    }

    console.log(authHeader);
    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            console.log(`request details: ${JSON.stringify(req.user)}\t${JSON.stringify(req.roles)}`);
            //something();
            next();
        }
    )
}

module.exports = verifyJWT;