import { crudControllers} from '../../utils/crud.js'
import { CarList } from '../models/carList_model.js'
import { User } from '../models/user.model.js'

const getMany=async(req, res)=>{
    let cars=[]
  await User.find().exec().then(users=>{
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
      cars.push({
            carDetail:{
                _id:user._id,
                username: user.username,
                car_model:user.car_model,
                image: user.image

            }
        })
    }
  })
  
  if(cars){
    res.status(200).json(cars)
  }
 
}


export default getMany
