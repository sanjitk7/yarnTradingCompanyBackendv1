const mongoose = require('mongoose')
const { default: validator } = require('validator')

const productSchema = mongoose.Schema({
    pCode: { 
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    pColor: { 
        type: String,
        required: true,
        trim: true
    },
    pCount: {
        type: Number,
        default:10,
        required: true,
        trim: true,
        validate(value){
            if (value>120 && value<0){
                throw new Error("Invalid Yarn Count Value")
            }
        }
        
    },
    pAvailability:{
        type: Boolean,
        default: true
    },
    pPriceEst :{
        type: Number
    },
    pDesc: {
        type: String,
        trim: true,
        validate(value){
            if (value.length>3000){
                throw new Error("Product Description is too long")
            }
        }
    },
    pPicture: {
        type: Buffer
    }

},{
    timestamps: true
})

// // Getter
// ItemSchema.path('pPriceEst').get(function(num) {
//     return (num / 100).toFixed(2);
//   });
  
//   // Setter
//   ItemSchema.path('pPriceEst').set(function(num) {
//     return num * 100;
//   });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;