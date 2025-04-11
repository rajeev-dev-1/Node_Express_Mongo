const  bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../model/User');

const loginUser = async (req, res) =>{
    const {username, password} = req.body;
    if(!username || !password){
        res.status(400).json({"message":"username and password needed"});
        return;
    }

    try{
        const foundUser = await User.findOne({username}).exec();
        if(!foundUser){
            res.status(401).json({"message": "Unauthorized Login"});
            return;
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if(!passwordMatch){
            res.status(401).json({"message":"Unauthorized Login"});
            return;
        }

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            //note: we should not keep password here
            //{"username": foundUser.username},
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s'}
        )
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )
        
        const result = await User.updateOne({username}, {refreshToken}).exec();
        console.log(`In LoginController, result: ${JSON.stringify(result)}`);
        //A chatgpt maxAge below is client side expiration i.e. in broswer
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    }catch(err){
        res.status(500).json({"message":`Server Error ${err.message}`});
    }

}

module.exports = {loginUser};