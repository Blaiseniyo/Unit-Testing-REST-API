const express  = require('express');
const app =express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

require("dotenv").config();

const routes=require('./routes/index');
const  mongoose  = require('mongoose');
const message = require('./models/message');

// if(process.env.NODE_ENV == 'dev'){
    mongoose.connect(process.env.db_connection,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:true,
        useCreateIndex:true
    });
// }
// else{
//     mongoose.connect(process.env.db_testing,{
//         useNewUrlParser:true,
//         useUnifiedTopology:true,
//         useFindAndModify:true,
//         useCreateIndex:true
//     });
// }

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-with,Content-Type,Accept,Authorization');
    if(req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})

// app.use('/',(req,res,next)=>{
//     res.send("welcome on our Rest-Api");
// });
app.use('/api',routes);


app.use((req,res,next)=>{
    const error = new Error('not fount');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports=app;