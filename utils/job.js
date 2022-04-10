import cron from 'node-cron'
import moment from 'moment'
import User from '../resources/models/user.model.js'

cron.schedule('* * * * *',async (req, res)=>{
    let today = moment(new Date()).format("YYYY-MM-DD hh:mm");
    const findusers = await User.find();
    if(findusers){
        for(let i = 0; i < findusers.length; i++) {
            const users = findusers[i];
            let userDueDate = moment(users.end_date).format("YYYY-MM-DD hh:mm");
            if(today === userDueDate){
                let find_user = await User.findById({_id:users._id});
                find_user.isActive = false;
            }
        }
    }
})