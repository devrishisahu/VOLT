import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Fill Name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Fill Email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please Fill Phone"],
    },
    password: {
      type: String,
      required: [true, "Please Fill Password"],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },   
    credits : {
      type : Number,
      default : 0,
      required : true
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    voltbotQueries: [{
      type: Date
    }],
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model('User' , userSchema)

export default User

