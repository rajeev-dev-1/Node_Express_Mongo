
const bcrypt = require('bcrypt');
const User = require('./../model/User');

const registerUser = async (req, res)=>{

    const {username, password} = req.body;
    if(!username || !password){
        return res.send(400).json({'message': 'username and password needed'});
    }

    const userFound = await User.findOne({username: username}).exec();
    if(userFound){
        return res.sendStatus(409);
    }

    //instructor did not tell why to use try catch but mys: we are hashing and writing to file so to catch
    //any possible errors
    try{
        const hashedPswd = await bcrypt.hash(password, 10);
        const newUser = await User.create( {
            'username': username,
            'password': hashedPswd            
        });
        //Object Id is also created along with the document, we just passed username and password
        console.log(newUser);
        res.status(201).json({'message': `New user ${username} Added!`})
    }catch(err){
        res.status(500).json({'message': err.message});
    }
    
    
}

module.exports = {registerUser}