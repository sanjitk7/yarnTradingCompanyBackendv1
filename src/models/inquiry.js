const { default: validator } = require('validator')

const mongoose = require('mongoose')

const inquirySchema = mongoose.Schema({
    inquirerName: { 
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required:true,
        lowercase: true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    phoneNumber : {
        type: String,
        // validate(value){
        //     if(!validator.isPhoneNumber(value)){
        //         throw new Error ("Invalid phone number")
        //     }
        // }
    },
    organisation : {
        type: String,
        required: true
    },
    organisationAddr: {
        type: String,
        required: true
    },
    estPurchaseSize: {
        type: Number,
        required: true,
        validate(value){
            if(value<0){
                throw new Error("Estimated Size Cannot Be Negative")
            }
        }
    },
    // Could replace type with mongoose.Schema.Types.ObjectId ( for virtual connection of the 2 collections)
    // But pCode is used instead of _id
    productsInq: [{
        productId:{
            type:String,
            required:true,
            validate(value){
                if (value.length>4 || value.length===0 || !validator.isAlphanumeric(value)){
                    throw new Error("Invalid Product Code")
                }
            }
        }
    }],
    remark: {
        type: String,
        validate(value){
            if (value.length>5000){
                throw new Error("Please keep the inquiry content withing 5000 chars")
            }
        }
    }

},{
    timestamps: true
})


const Inquiry = mongoose.model("Inquiry",inquirySchema)

module.exports = Inquiry