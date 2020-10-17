const express = require("express")
const Product = require("../models/product")
const Inquiry = require("../models/inquiry")
const {auth, adminAuth} = require("../middleware/auth")
const router = express.Router()


// List of Products an Number of Inquiries they have received

router.get("/product-to-inquiry-count",auth, adminAuth, async (req,res)=>{
    try {
    const productCount = await Product.find({},"pCode pInquiries")
    let productsInqCountArr = []
    for (let i=0;i<productCount.length;i++){
        tempProductObject = {
            pId:productCount[i]._id,
            pCode: productCount[i].pCode,
            pInqNumber: productCount[i].pInquiries.length
        }
        productsInqCountArr.push(tempProductObject)
    }
    res.send(productsInqCountArr)
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
})

module.exports = router
