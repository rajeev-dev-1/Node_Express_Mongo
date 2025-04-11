require('dotenv').config();// we can keep dotenv here i.e. in server.js rather keeping evrywhere in differnt
//files
const path = require('path');
const express = require('express');
const {logger} = require('./middleware/logEvents');
const errorLogger = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB =  require('./config/dbConn');
const app = express();


const PORT = process.env.PORT || 3500;

connectDB();// i.e. connect to DB in very beginning itself and if not connected we are not ready to listen on
// port 3500
app.use(express.json());// I kept here not the instructor so that I can log request object as well in log files
app.use(cookieParser());
//Custom MW
app.use(logger);

//3rd Party MW
app.use(cors(corsOptions));

//Built-In Middlewares
app.use(express.urlencoded({extended: false}));
app.use('/',express.static(path.join(__dirname, '/public')));//mys: default is /(1st param in app.use) i.e. root




app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
//mys: anything coming in url like /subdir will be handled by router in subdir.js
//look at where its kept above all routes for root dir, if order changes
//we might get 404 nsc
//w.r.t jwt we want to protect all employees routes so we kept following
//note where to keep this matters as all routes after this will be protected
app.use(verifyJWT);
app.use('/employees', require('./routes/api/empoyees'));


app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: '404 Does not exist'});
    } else {
        res.type('text').send('404 Does not exist');
    }
})

app.use(errorLogger);
mongoose.connection.once('open', ()=>{
    //i.e. we want to listen only once the connection is made mys: its 'open'.
    // i.e. we don't want to listen on port 3500 if mongodb is not connected.
    console.log('Connected to mongo DB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});