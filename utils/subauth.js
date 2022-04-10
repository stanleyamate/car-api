


const checksubscribe = async (req, res, next)=>{
    const userData = req.userData;
    
    if(req.userData.role == "user"){
        res.status(401).json({ meaasage : "not auth, Admins only" })
    }else{
        next();
    }
}
export default checksubscribe