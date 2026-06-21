import User from "../models/userModel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if all fields are coming
  if (!name || !email || !phone || !password) {
    res.status(409);
    throw new Error("Please Fill All Details");
  }

  //Cheack if User exists

  let emailExist = await User.findOne({ email: email });
  let phoneExist = await User.findOne({ phone: phone });

  if (emailExist || phoneExist) {
    res.status(400);
    throw new Error("User already Exists!");
  }

  //Hashing Password

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error("User not Created");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    credits: user.credits,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are coming
  if (!email || !password) {
    res.status(409);
    throw new Error("Please Fill All Details");
  }

  //Check if User exists

  let user = await User.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      credits: user.credits,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
};

//Private Controller

const privateController = (req, res) => {
  res.send("Private Controller " + req.user.name);
};

const getUserInfo = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

//Generate token

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

const authController = { registerUser, loginUser, privateController, getUserInfo };

export default authController;
