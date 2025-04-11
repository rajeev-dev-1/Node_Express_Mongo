const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User:{
            type: Number,
            default: 3000
        },
        Admin: Number,
        Editor: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

//note: User in mongoose.model will become users in mongodb, its as per mongoose documentation
module.exports = mongoose.model('User', userSchema)