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


const app = express()
app.use(cors({
    origin:"http://localhost:3000",
    withCredentials:true
}))
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))

app.use('/uploads',express.static('uploads'))
// app.disabled('x-powered-by')
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
app.post('/register',uploadImg, register)
app.post('/login', login)
app.get('/service', getAllServices)

app.use('/api', auth)
app.patch('/api/subscribe/:id', subscribe)
app.patch('/api/unsubscribe/:id', unsubscribe)
app.patch('/api/car/:id', updateCar)
// app.use('/cars',uploadImg, carRouter)
app.use('/api/admin/carlist',checkUser, carListRouter)
app.use('/api/admin',checkUser, adminRouter)

app.get('/api/dashboard', checkUser, (req, res)=>{res.json({dashboard:"fully subscribed"})})

app.listen(process.env.PORT,() => {
     console.log(`app is listening to port ${process.env.PORT}`);
})



