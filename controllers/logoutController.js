const User = require('./../model/User');

const logoutUser = async (req, res) =>{
    //here point is delete accessToken and refreshToken.
    //client side also delete accessToken when user click logout button
    //we can set it to empty or whatever
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(204);// i.e. its successfule ok, but no content
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();

    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }

    const result = await User.updateOne({refreshToken}, {refreshToken: ''}).exec();
    console.log(`In logoutController result: ${JSON.stringify(result)}`);
    //mys: clearcookie will ask to delete from browser as well, might be from thunderclient also
    res.clearCookie('jwt', {httpOnly: true});
    return res.sendStatus(204);

}

module.exports = {logoutUser};