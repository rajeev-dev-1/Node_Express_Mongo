const whiteList = [
    'https://www.google.com', 
    'http://localhost:3500/',
    'https://node-express-mongo-5zbp.onrender.com'
];
const corsOptions = {
    origin: (origin, callback)=>{
        if(whiteList.indexOf(origin) != -1 || origin === undefined){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
