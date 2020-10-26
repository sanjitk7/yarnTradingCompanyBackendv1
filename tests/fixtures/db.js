const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Employee = require("../../src/models/employee")
const Inquiry = require("../../src/models/inquiry")
const Product = require("../../src/models/product")

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const productOneId = new mongoose.Types.ObjectId()
const productTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id:userOneId,
    name: "test user",
    email: "test2@example.com",
    password: "Hello12344",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id:userTwoId,
    name: "test user",
    email: "test3@example.com",
    isAdmin: true,
    password: "Hello12344",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const inquiryOne = {
    _id: new mongoose.Types.ObjectId(),
    inquirerName: "John Doe",
    email: "john@example.com",
    phoneNumber:"123456789",
    organisation: "Sun Yarns Retail",
    organisationAddr: "56, Cholan Street, Chennimalai",
    estPurchaseSize: 100,
    productInqId: productOneId,
    productInqCode:"R0004",
    estPurchaseSize:200,
    organisationAddr: {
        lineOne: "Sample Address 1",
        lineTwo: "Sample Address 2",
        city: "Bangalore",
        state:"Karnataka",
        pincode:638051
    },
    remark: "Interested in the R001 Red Color 20s Count Yarn"
}

const inquiryTwo = {
    _id: new mongoose.Types.ObjectId(),
    inquirerName: "Jane Doe",
    email: "jane@example.com",
    phoneNumber:"987654321",
    organisation: "Moon Yarns Retail",
    organisationAddr: {
        lineOne: "Sample Address 1",
        lineTwo: "Sample Address 2",
        city: "Erode",
        state:"Tamil Nadu",
        pincode:638051
    },
    estPurchaseSize: 100,
    productInqId: productTwoId,
    productInqCode:"R0002",
    estPurchaseSize:100,
    remark: "Interested in the R002 Navy Blue Color 20s Count Yarn"
}

const productOne = {
    _id:productOneId,
    pCount: 30,
    pAvailability: true,
    pCode: "R0004",
    pColor: "Lemon Yellow",
    pPriceEst: 91,
    pQty: 100,
    pDesc: "Purchased from Saraswathi Mills and Stock Updated on 12.12.12",
    pPictureCode:1
}

const productTwo = {
    _id: productTwoId,
        pCount: 20,
        pAvailability: true,
        pPriceEst: 63,
        pCode: "R0002",
        pColor: "Ocean Blue",
        pDesc: "Predominantly bought by bedsheets textile weavers of south Salem, Karur and Chennimalai",
        pPictureCode:2,
        pQty: 100

}


const setupdb = async ()=>{
    await Employee.deleteMany()
    await Inquiry.deleteMany()
    await Product.deleteMany()
    await new Employee(userOne).save()
    await new Employee(userTwo).save()
    await new Inquiry(inquiryOne).save()
    await new Inquiry(inquiryTwo).save()
    await new Product(productOne).save()
    await new Product(productTwo).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    setupdb,
    inquiryOne,
    inquiryTwo,
    productOne,
    productTwo
}