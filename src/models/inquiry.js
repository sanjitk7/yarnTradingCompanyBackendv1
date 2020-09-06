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
    estPuchaseSize: {
        type: Number,
        required: true,
        validate(value){
            if(value<0){
                throw new Error("Estimated Size Cannot Be Negative")
            }
        }
    },
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