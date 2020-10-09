const express = require('express')
const Inquiry = require('../models/inquiry.js')
const Product = require('../models/product')
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

router.get("/", auth, adminAuth, async (req,res) => {

    try {

        const allInquiries = await Inquiry.find({})

        if (!req.user){
            return res.status(404).send("Nothing")
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

// List all products this inquiry inquires about
router.get("/:id/list-products", auth,adminAuth, async (req,res)=>{
    try {

        const foundInquiry = await Inquiry.findById(req.params.id)
        await foundInquiry.
        populate("productsInq").
        execPopulate()

        res.send(foundInquiry)
    } catch (e) {
        console.log(e)
        res.status(400).send({error:e})
    }
})

// List all inquires this product has received
router.get("/:id/list-inquires",auth, adminAuth, async (req,res)=>{
    try {
        productId = req.params.id
        let eachInquiryProducts = undefined
        productInquiries = [] // the inquires received about the given product (product id in params)
        const allInquiries = await Inquiry.find({})
        for (let i=0;i<allInquiries.length;i++) {
            eachInquiryProducts = allInquiries[i].productsInq
            if (eachInquiryProducts.includes(productId)){
                productInquiries.push(allInquiries[i])
            }
        }

        res.send(productInquiries)
    } catch (e) {
        console.log(e)
    }
})
module.exports = router