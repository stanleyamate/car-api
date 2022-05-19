import cron from 'node-cron'
import moment from 'moment'
import { User } from '../resources/models/user.model.js'

export const subscriptionChecker = ()=>{
    cron.schedule('30 * * * *',async function(){
        console.log("--- Subscription expiratory checker STARTED ---")
        let today = moment(new Date()).format("YYYY-MM-DD hh:mm");
        const findUsers = await User.find({isActive: true});
        if(findUsers){
            for(let i = 0; i < findUsers.length; i++) {
                const user = findUsers[i];
                let userDueDate = moment(user.end_date).format("YYYY-MM-DD hh:mm");
                if(today === userDueDate || today > userDueDate){
                    try {
                        await User.findOneAndUpdate(
                          { _id : user._id},{ plan: "none",isActive:false, end_date: null, show_end_date:""}, { new: true }
                          )
                          .exec()
                          console.log(`${user.username} Unsubscription succeeded`)
                      } catch (error) {
                        console.log(error)
                      }
                      
                }
            }
        }
            console.log("--- Subscription expiratory checker ENDED ---")
          
    })
}
