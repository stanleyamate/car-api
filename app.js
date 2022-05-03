import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import "dotenv/config.js";
import carListRouter from './resources/routes/carListRoute.js'
import carRouter from './resources/routes/carsRouter.js'
import { register, login, subscribe, unsubscribe, uploadImg, updateCar } from './resources/controllers/user.controller.js'
import {getAllServices} from './resources/controllers/services.controller.js'
import adminRouter from './resources/routes/admin.router.js'
import auth from './utils/auth.js';
import checkUser from './utils/subauth.js';
import checkActive from './utils/checkActive.js';
import { subscriptionChecker } from './utils/job.js';


const app = express()
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
 
mongoose.connect('mongodb+srv://jamjohnson:sta78726486@cluster0.orzn2.mongodb.net/auto-care?retryWrites=true&w=majority', function(err) {
    if (err) throw err;
    console.log("Database Running...");
}
)

//user routes
app.get('/', (req, res)=>res.send({message:"welcome to auto-care api"}))
app.post('/register',uploadImg, register)
app.post('/login', login)
app.get('/service', getAllServices)

app.use('/api', auth)
app.patch('/api/subscribe/:id', subscribe)
app.patch('/api/unsubscribe/:id', unsubscribe)
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

