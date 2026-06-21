import User from "../models/userModel.js";
import Event from"../models/eventModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";

const getAllUsers = async(req, res) => {


    const users = await User.find()

    if (!users) {
        res.status(404);
        throw new Error ("Users Not Found")
        
    }

    res.status(200).json(users)
};


const updateUser = async(req , res) => {



  const {isActive , credits} = req.body

  const userId = req.params.uid

 let user = await User.findById(userId)
 if(!user){
   res.status(404)
    throw new Error("User Not Found!")
 }

 let updatedUser

 if(credits){

    updatedUser = await User.findByIdAndUpdate(userId , {credits : user.credits + parseInt(credits) } , {new : true})
 }else{
    updatedUser = await User.findByIdAndUpdate(userId , {isActive : isActive} , {new : true})
 }

  if(!updatedUser){
    res.status(409)
    throw new Error("User Not Updated!")
  }
  res.status(200).json(updatedUser)
}


const getAllEvents = async(req, res) => {

     const events = await Event.find().populate('user')

    if (!events) {
        res.status(404);
        throw new Error ("Events Not Found")
        
    }

    res.status(200).json(events)

};


const updateEvent = async(req, res) => {

  const eventId = req.params.eid

  const updatedEvent = await Event.findByIdAndUpdate(eventId , req.body , { new : true }).populate('user')

  if(!updatedEvent) {
    res.status(409)
    throw new Error("Event not Updated..")

  }

  res.status(200).json(updatedEvent)

}


const getAllRatings = (req, res) => {
  res.send("All Ratings!");
};


const getAllOrders = async(req, res) => {
 
  const orders = await Order.find().populate('user').populate('event')

  if(!orders){
    res.status(404)
    throw new Error("Orders Not Found!")
  }
  res.status(200).json(orders)
};

const createCoupon = async(req, res)=>{

  const {couponCode , couponDiscount} = req.body

  if(!couponCode || !couponDiscount){
    res.status(409)
    throw new Error("Please Fill All The Details")
  }
 
  // check if coupon is already exists

  const couponExist = await Coupon.findOne({couponCode})

  if(couponExist){
    res.status(409)
    throw new Error("Coupon Already Exists")
  }


  const newCoupon = await Coupon.create({couponCode , couponDiscount})

  if(!newCoupon){
    res.status(409)
    throw new Error("Coupon Not Created!")
  }
  res.status(200).json(newCoupon)



}


const getAllCoupons = async(req, res) => {

const coupons = await Coupon.find()

if (!coupons){
  res.status(404)
  throw new Error("Coupons not Found..")
}
res.status(200).json(coupons)

  
};

const updateCoupon = async( req , res ) =>{

  const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.cid , req.body , {new : true})

  if(!updatedCoupon){
    res.status(404)
    throw new Error("Coupon Not Updated..")
  }
  res.status(200).json(updatedCoupon)


}

const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.cid);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon Not Found");
  }
  res.status(200).json({ id: req.params.cid });
};

const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.eid);
  if (!event) {
    res.status(404);
    throw new Error("Event Not Found");
  }
  res.status(200).json({ id: req.params.eid });
};

const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.oid);
  if (!order) {
    res.status(404);
    throw new Error("Order Not Found");
  }
  res.status(200).json({ id: req.params.oid });
};

const adminController = { getAllUsers , updateUser , getAllEvents , getAllRatings, getAllOrders, deleteOrder, getAllCoupons ,updateEvent , createCoupon , updateCoupon, deleteCoupon, deleteEvent};

export default adminController


