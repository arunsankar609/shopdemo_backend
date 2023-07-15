import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  username: {
        type: String,
        required: true,
      },
      email: {
        type:String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },  
      gender: {
        type: String,
        required: true,
      },

})

const ElectricUsers = mongoose.model("ElectricUsers", userSchema);



export default ElectricUsers