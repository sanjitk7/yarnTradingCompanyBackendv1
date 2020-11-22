const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const bodyParser = require('body-parser')
const Product = require('../models/product.js')
const {auth, adminAuth} = require("../middleware/auth")
const urlencodedParser = bodyParser.urlencoded({ extended:false})
const router = express.Router()


const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req,file,cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/)) {
            return cb(new Error("Upload Proper File"))
        }
        cb(undefined,true)
    }
})


//CRUD Operations for Products by Employees

//Create Products
router.post("/",urlencodedParser, auth, upload.single("pPicture"), async (req, res) => {
    
    try {
        
        // const product = new Product(req.body)
        console.log(req.body)

        if (!req.file){
            const product = new Product({
                ...req.body
            })
            await product.save()
            return res.status(201).send(product)
        }

            const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250}).png().toBuffer()
            const product = new Product({
                ...req.body,
                pPicture: buffer,
                pPictureURL: `${process.env.API_BASE_URL}/products/picture/` + req.body.pCode
            })
            await product.save()
            res.status(201).send(product)
        
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

// GET /products?availability=true
// GET /products?limit=2&skip=2
// GET /products?sortBy=createdAt:asc
//View All Products
router.get("/summary", async (req,res) => {

    const match = {}
    const sort = {}

    if (req.query.availability) {
        match.pAvailability = req.query.availability === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === "asc" ? 1: -1
    }

    try {

        const allProducts = await Product.find(match)

        // if (!req.user){
        //     return res.status(404).send()
        // }
        res.send(allProducts)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

//View Product with ProductID

router.get("/:code", async (req,res) => {
    const pid = req.params.code

    try {
        const foundProduct = await Product.findOne( { pCode:pid} )
        if (!foundProduct){
            return res.status(404).send()
        }
        res.send(foundProduct)
    } catch (e) {
        res.status(500).send()
    }
})

// Updating Existing Products
router.patch("/:code",urlencodedParser, auth, async (req,res) => {
    console.log("Update Route is HIT")
    const pid = req.params.code
    const updateFieldsReq = Object.keys(req.body)
    const validFields = ["pCount", "pAvailability", "pPriceEst", "pDesc"]
    const isValidateFields = updateFieldsReq.every( (field) => validFields.includes(field))

    if (!isValidateFields){
        console.log(req.body)
        console.log("valid fields are", validFields)
        return res.status(400).send({ "error":"Invalid Update Requested"})
    }

    try{
        console.log(req.body)
        const foundProduct = await Product.findOne({pCode: req.params.code})
        updateFieldsReq.forEach((updateField) => foundProduct[updateField] = req.body[updateField])

        if (!foundProduct){
            return res.status(404).send()
        }
                
        await foundProduct.save()
        console.log("Updated "+foundProduct.pCode)
        console.log("Requested Update:",req.body)
        res.send(foundProduct)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.delete("/:code", auth, async (req,res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({pCode:req.params.code})
        if (!deletedProduct){
            return res.status(404).send()
        }
        res.send(deletedProduct)
    } catch (e) {
        res.status(500).send()
    }
})


// GET picture
router.get("/picture/:code", async (req,res) => {
    try{

        const product = await Product.findOne({pCode: req.params.code})

        if(!product || !product.pPicture) {
            throw new Error("Product or Picture doesn't exist")
        }

        res.set("Content-Type","image/png")

        res.send(product.pPicture)
    } catch (e) {
        console.log(e)
        res.status(404).send(e)
    }
})

module.exports = router