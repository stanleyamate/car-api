import { User } from "../models/user.model.js";

export const getAllEmployees = async (req, res)=>{
    try {
        const doc = await User.find({role:"admin"}).exec();
    if (!doc) {
        res.status(404).end();
    }
    res.status(200).json({ data: doc });
    } catch (error) {
        res.status(500).json(err)
    }
}