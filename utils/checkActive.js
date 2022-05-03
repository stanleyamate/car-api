
const checkActive = async (req, res, next)=>{
    const userData = req.userData;
    
    if(req.userData.isActive == false){
        res.status(401).json({ message : "not auth, select plan to subscribe" })
    }else{
        next();
    }
}
export default checkActive