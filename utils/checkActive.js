
const checkActive = async (req, res, next)=>{
    const userData = req.userData;
    
    if(req.userData.isActive == false){
        res.status(401).json({ msg : "not auth, select plan to subcribe" })
    }else{
        next();
    }
}
export default checkActive