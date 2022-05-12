import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import "dotenv/config.js";
import carListRouter from './resources/routes/carListRoute.js'
import { register, login, subscribe, unsubscribe, uploadImg, updateCar } from './resources/controllers/user.controller.js'
import {getAllServices} from './resources/controllers/services.controller.js'
import adminRouter from './resources/routes/admin.router.js'
import auth from './utils/auth.js';
import checkUser from './utils/subauth.js';
// import checkActive from './utils/checkActive.js';
import { subscriptionChecker } from './utils/job.js';
import helmet from 'helmet'
import compression from 'compression'


const app = express()

// for security
app.use(helmet())
//for fast loading of routes
app.use(compression());
app.use(cors({
    origin:"http://localhost:3000",
    withCredentials:true
}))
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))

app.use('/uploads',express.static('uploads'))
app.use(morgan(
    function(tokens, req, res){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
    }
))
var settings = {
    server : {
      reconnectTries : Number.MAX_VALUE,
      autoReconnect : true
    }
  };

mongoose.connect(process.env.URL, function(err) {
    if (err) throw err;
    console.log("Database Running...", mongoose.connection.readyState);
}
)
//user routes
app.get('/', (req, res)=>res.send({message:"welcome to auto-care api"}))
app.post('/register',uploadImg, register)
app.post('/login', login)
app.get('/service', getAllServices)

app.use('/api', auth)
app.put('/api/subscribe/:id', subscribe)
app.put('/api/unsubscribe/:id', unsubscribe)
app.patch('/api/car/:id',uploadImg, updateCar)
app.use('/api/admin/carlist', carListRouter)
app.use('/api/admin',checkUser, adminRouter)
app.use( (req, res, next)=>{
    const error = new Error("Not Found");
    error.status=404;
    next(error)
})
app.use((error, req, res, next)=>{
       res.status(error.status || 500);
       res.json({
           error:{
               message: error.message
           }
       });
})

// run cron job to check for expired users
subscriptionChecker()

app.listen(process.env.PORT,() => {
     console.log(`app is listening to port ${process.env.PORT}`);
})

