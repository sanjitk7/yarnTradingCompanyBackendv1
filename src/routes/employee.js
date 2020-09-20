const express = require('express')

const Employee = require("../models/employee.js")
const auth = require("../middleware/auth.js")
const router = express.Router()

router.get("/",(req,res) =>{
    res.send("Test")
})

// Create Account
router.post("/create-employee", async (req,res) => {

    const newUser = new Employee(req.body)
    try{
        // console.log(req.body)
        // console.log("Register Route")       
        await newUser.save()
        const token = await newUser.generateToken()


        res.status(201).send({newUser,token})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//Login
router.post("/login", async (req,res) => {
    try{
        // console.log("befoe")
        const userFound = await Employee.findByCredentials(req.body.email, req.body.password)
        // console.log(userFound)
        const token = await userFound.generateToken()
        // console.log(token)
        res.cookie('token', token, { httpOnly: true });
        res.send({userFound,token})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//Logout
router.post("/logout", auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/logout-all", auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        
    } catch (e){
        res.status(500).send()
    }
})


module.exports = router