const jwt = require("jsonwebtoken")
const Employee = require("../models/employee")


// The following function acts to authenticate a request from the client. The client will send the requesting user's login token (web token) as the 'authorization' header.
// This header has in it the token to be authorized. This authorization is done with jwt verify() and if it is verified, then the request is granted

const auth = async function (req,res,next) {

    try{
        const token = req.header("Authorization").replace("Bearer ","")
        // console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await Employee.findOne( { _id: decoded._id, "tokens.token":token })
        
        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send("Please authenticate")
    }
}

const adminAuth = function (req,res,next){
    try{
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // console.log("from Admin Auth: isAdmin: ",decoded.isAdmin)
        if(decoded.isAdmin ==="false"){
            throw new Error()
        }
        next() 
    } catch(e){
        res.status(401).send("You do not have admin privilege.")
    }
}

module.exports = {
    auth,
    adminAuth
}