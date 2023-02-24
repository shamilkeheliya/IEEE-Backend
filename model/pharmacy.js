const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pharmacy_license_number: {
      type: String,
      required: true,
    },
    drug: {
      type: [String],
      required: false,
    },

    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isVerify: {
      type: Boolean,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: false,
    },
    ownerNIC: {
      type: String,
      required: false,
    },
    ownerAddress:{
      type: String,
      required: false,
    }
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pharmacy", pharmacySchema);
