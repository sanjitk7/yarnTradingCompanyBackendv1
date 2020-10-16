const mongoose = require("mongoose");
const { default: validator } = require("validator");

const productSchema = mongoose.Schema(
  {
    pCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    pColor: {
      type: String,
      required: true,
      trim: true,
    },
    pCount: {
      type: Number,
      default: 10,
      required: true,
      trim: true,
      validate(value) {
        if (value > 120 && value < 0) {
          throw new Error("Invalid Yarn Count Value");
        }
      },
    },
    pAvailability: {
      type: Boolean,
      default: true,
    },
    pPriceEst: {
      type: Number,
      default: 0,
    },
    pDesc: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (value.length > 3000) {
          throw new Error("Product Description is too long");
        }
      },
    },
    pQty: {
      type: Number,
      trim: true,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Quantity cannot be negetive");
        }
      },
    },
    pPicture: {
      type: Buffer,
    },
    pPictureCode: {
      type: Number,
      required: false,
    },
    pPictureURL: {
      type: String,
    },
    pInquiries: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inquiry",
      }],
  },
  {
    timestamps: true,
  }
);

// // Getter
// ItemSchema.path('pPriceEst').get(function(num) {
//     return (num / 100).toFixed(2);
//   });

//   // Setter
//   ItemSchema.path('pPriceEst').set(function(num) {
//     return num * 100;
//   });

// return product without picture when listing

productSchema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();

  delete productObject.pPicture;

  return productObject;
};

// create a virtual reverse relationship bw product-> inquiry : Established a connection/relationship/mapping

productSchema.virtual("inq", {
  ref: "Inquiry",
  localField: "_id",
  foreignField: "productsInq",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
