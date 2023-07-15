import ElectricUsers from "../mongodb/models/electricUsers.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, city, state, gender } = req.body;

    const userExists = await ElectricUsers.findOne({ email });
    if (userExists) {
      res.status(500).json({ message: "User already exists" });
      console.log("response", res.statusCode);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const newUser = new ElectricUsers();
      newUser.username = username;
      newUser.email = email;
      newUser.password = hash;
      newUser.city = city;
      newUser.state = state;
      newUser.gender = gender;
      console.log("new user", newUser);
      await newUser.save(newUser);
      res.json({ message: "User successfully created" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const userLogin  = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await ElectricUsers.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // At this point, the user is authenticated
    // You can generate a token here and include it in the response if using JWT, for example
    req.session.user = user;
    console.log("zzzzzzzzzzz", req.session.user);
    res.json({ data:user,message: "Login successful" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const verifyUser=(req,res)=>{
  if(req.session.user){
    res.status(200);
    next();
  }else{
    res.status(500);
  }
}


export { createUser,userLogin,verifyUser };
