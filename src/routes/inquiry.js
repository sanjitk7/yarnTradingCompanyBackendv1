const express = require('express')
const Inquiry = require('../models/inquiry.js')
const {auth, adminAuth} = require("../middleware/auth.js")

const router = express.Router()



//Create Inquiry

router.post("/", async (req, res) => {
    const inquiry = new Inquiry(req.body)
    try {
        await inquiry.save()
        res.status(201).send(inquiry)
    } catch (e) {

        res.status(400).send(e)
    }
})

//List all inquiries

router.get("/", auth, async (req,res) => {

    try {

        const allInquiries = await Inquiry.find({})

        if (!req.user){
            return res.status(404).send()
        }
        res.send(allInquiries)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//Delete inquiry
router.delete("/:id", auth, async (req,res) => {
    try {
        const deletedInquiry = await Inquiry.findOneAndDelete({_id:req.params.id})
        if (!deletedInquiry){
            return res.status(404).send()
        }
        res.send(deletedInquiry)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router