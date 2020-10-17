const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended:false})
const Inquiry = require('../models/inquiry.js')
const Product = require('../models/product')
const {auth, adminAuth} = require("../middleware/auth.js")

const router = express.Router()

//Create Inquiry

router.post("/",urlencodedParser, async (req, res) => {

    try {
        const foundProductInquired = await Product.findOne({pCode:req.body.productInqCode})
        // console.log("found product being inquired about"+foundProductInquired)

        const inquiry = new Inquiry({
            ...req.body,
            productInqId:foundProductInquired._id
        })

        foundProductInquired.pInquiries.push(inquiry._id)
        await foundProductInquired.save()

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
        // Delete this inquiry's ID from the product's pInquiries list
        const foundProductInquired = await Product.findOne({_id:deletedInquiry.productInqId})
        // console.log("@@@@@",foundProductInquired.pInquiries)
        foundProductInquired.pInquiries = foundProductInquired.pInquiries.filter((inquiryId)=>{
            // console.log("$$$:",inquiryId,deletedInquiry._id)
            const flag = inquiryId.toString() != deletedInquiry._id.toString()
            // console.log("flag:",flag)
            return inquiryId.toString() != deletedInquiry._id.toString()
        })
        // console.log(foundProductInquired.pInquiries)
        await foundProductInquired.save()
        res.send(deletedInquiry)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

// List  product this inquiry inquires about
router.get("/:id/list-product", auth,adminAuth, async (req,res)=>{
    try {

        const foundInquiry = await Inquiry.findById(req.params.id)
        const foundInquiryProduct = await Product.findById(foundInquiry.productInqId)

        res.send(foundInquiryProduct)
    } catch (e) {
        console.log(e)
        res.status(400).send({error:e})
    }
})

// List  product with the inquiries they have received
router.get("/:id/list-inquires",auth, adminAuth, async (req,res)=>{
    try {
        const foundProduct = await Product.findById(req.params.id)
        console.log(foundProduct)
        await foundProduct.
        populate("pInquiries").
        execPopulate()
        res.send(foundProduct.pInquiries)
    } catch (e) {
        console.log(e)
    }
})



module.exports = router