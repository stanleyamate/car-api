import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import "dotenv/config.js";
import carListRouter from './resources/routes/carListRoute.js'
import carsRouter from './resources/routes/carsRouter.js'
import { register, login } from './resources/controllers/user.controller.js'
import auth from './utils/auth.js';


const app = express()
app.use(cors())
app.use(express.json())
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


mongoose.connect(process.env.MONGO_URL, function(err, data) {
    if (err) throw err;
    console.log("Database created!");
}
)
//user routes
app.post('/register', register)
app.post('/login', login)

app.use('/api', auth)
app.use('/api/cars', carsRouter)
app.use('/api/carlist', carListRouter)

app.listen(process.env.PORT,() => {
     console.log(`app is listening to port ${process.env.PORT}`);
})


