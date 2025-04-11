const jwt = require('jsonwebtoken');
const User = require('./../model/User');

const refreshToken = async (req, res) =>{

    const cookies = req.cookies;
    //mys: !cookies?.jwt means either cookies is not there or if its there then jwt is not on cookies
    //note if we don't use cookie parser in server js as middleware we'll get undefined here i.e. cookies
    if(!cookies?.jwt){// i..e checking if cookies is not there or if its there then if jwt is not there
        //in either case return 401.
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    console.log(`refreshToken: ${refreshToken}`);
    //We are comparing with refreshToken as this is only passed in the request.
    //this was saved while user logged in i.e. when auth or login endpoint called
    
    const foundUser = await User.findOne({refreshToken});
    if(!foundUser){
        return res.sendStatus(401);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=>{
            if(err || foundUser.username !== decoded.username){// checking for username as in refreshToken 
                //coming in request name might be tampered.
                return res.sendStatus(403);//Forbidden
            }
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                // {"username": foundUser.username},
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },                
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '60s'}
            );
            res.json({accessToken});
        }
    );

}

module.exports = {refreshToken}