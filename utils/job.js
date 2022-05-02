import cron from 'node-cron'
import moment from 'moment'
import { User } from '../resources/models/user.model.js'

export const subscriptionChecker = (req, res)=>{
    cron.schedule('30 * * * * *',async function(){
        console.log("subscription expiratory checker running...")
        let today = moment(new Date()).format("YYYY-MM-DD hh:mm");
        const findUsers = await User.find({isActive: true});
        if(findUsers){
            for(let i = 0; i < findUsers.length; i++) {
                const user = findUsers[i];
                let userDueDate = moment(user.end_date).format("YYYY-MM-DD hh:mm");
                if(user.isActive === true && (today === userDueDate || today > userDueDate)){
                    // let find_user = await User.findById({_id:users._id});
                    // find_user.isActive = false;
                    try {
                        await User.findOneAndUpdate(
                          { _id : user._id},{ plan: "none", isActive:false, end_date: null}, { new: true }
                          )
                          .exec()
                          console.log(`${user.username} subscription has expired`)
                      } catch (error) {
                        console.log(error)
                      }
                }
            }
        }
    })
}
