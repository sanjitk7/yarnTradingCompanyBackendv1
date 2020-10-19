const express = require("express")
const Product = require("../models/product")
const Inquiry = require("../models/inquiry")
const {auth, adminAuth} = require("../middleware/auth")
const router = express.Router()


// List of Products an Number of Inquiries they have received

router.get("/product-to-inquiry-count", async (req,res)=>{
    try {
    const productCount = await Product.find({},"pCode pInquiries")
    let productsInqCountArr = []
    for (let i=0;i<productCount.length;i++){
        tempProductObject = {
            x: productCount[i].pCode,
            y: productCount[i].pInquiries.length
        }
        productsInqCountArr.push(tempProductObject)
    }
    res.send(productsInqCountArr)
    } catch (e) {
        console.log(e)
        res.status(500).send({e})
    }
})

// Number of Inquires Obtained from different States

router.get("/state-to-inquiries", async (req,res)=>{
    try{
        let allstates = [ "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttarakhand",
                "Uttar Pradesh",
                "West Bengal",
                "Andaman and Nicobar Islands",
                "Chandigarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Delhi",
                "Lakshadweep",
                "Puducherry"]
            
        const inquiries = await Inquiry.find({},"organisationAddr")
        listOfStatesRepeatedInquires = [] // Extract all states attributes from the above list of all organisationAddr
        for (let i = 0; i < inquiries.length; i++){
            listOfStatesRepeatedInquires.push(inquiries[i]["organisationAddr"]["state"])
        }

        // Filter out incorrect states
        listOfStatesRepeatedInquires = listOfStatesRepeatedInquires.filter((state)=>{
            return allstates.includes(state)
        })


        // create a dict/hashmap/obj based on the number of repetitions of states
        counter = {}
        listOfStatesRepeatedInquires.forEach((state) => {
            counter[state] = (counter[state] || 0) + 1
        })

        // create list of objects for data vis lib format
        let resArr = []
        Object.keys(counter).forEach(function(key,index) {
            resArr.push({
                x:key,
                y:counter[key]
            })
        })
        res.send(resArr)

    } catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})


// Average Product Purchase size

router.get("/avg-pdt-purchase-size", async (req,res)=>{
    try{
        const allProducts = await Product.find({},"pInquiries pCode")
        let resArr = []
        for (let i=0; i<allProducts.length;i++){
            console.log("Product:",allProducts[i].pCode)
            let sum = 0 // Sum of all product inquiry purchase est sizes
            for (let j=0; j<allProducts[i].pInquiries.length;j++){
                let tempInquiryId = allProducts[i].pInquiries[j]
                let tempInquiryObject = await Inquiry.findById(tempInquiryId,"estPurchaseSize")
                sum +=tempInquiryObject.estPurchaseSize
                // console.log("sum:",sum)
            }
            resArr.push({
                x:allProducts[i].pCode,
                y: sum/(allProducts[i].pInquiries.length || 1)
            })
        }
        res.send(resArr)
    } catch (e) {
        console.log(e)
        res.status(500).send("Error Encountered")
    }
})


// // Yarn Count Vs Yarn Inquiries

router.get("/count-to-inquiries", async (req, res) => {
    try {
        const allProducts = await Product.find({},"pInquiries pCount pCode")

        countObj = {}
        for (let i=0; i<allProducts.length; i++) {
            if (!Object.keys(countObj).includes(allProducts[i].pCount.toString())){
                // console.log(allProducts[i].pCount)
                countObj = {
                    ...countObj,
                    [allProducts[i].pCount]:allProducts[i].pInquiries.length
                }
                console.log(countObj,allProducts[i].pCode)
            }
            else {
                console.log("pCount " +allProducts[i].pCount+" already exists so incrementing obj")
                countObj[allProducts[i].pCount] = allProducts[i].pInquiries.length + 1
            }
        }

        // create list of objects for data vis lib format
        let resArr = []
        Object.keys(countObj).forEach(function(key,index) {
            resArr.push({
                x:key,
                y:countObj[key]
            })
        })
        res.send(resArr)
    } catch (e){
        console.log(e)
        res.status(500).send("Error Encountered")
    }
})

module.exports = router
