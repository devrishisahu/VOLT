import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getTickets = async (req, res) => {
  const myTickets = await Order.find({ user : req.user.id })
    .populate("user")
    .populate("event");

    console.log(req.user)

  if (!myTickets) {
    res.status(404);
    throw new Error ("Tickets Not Booked Yet...");
  }
  res.status(200).json(myTickets);
};

const getTicket = async (req, res) => {
  const myTicket = await Order.findById(req.params.tid)
    .populate("user")
    .populate("event");

  if (!myTicket) {
    res.status(404);
    throw new Error("Ticket Not Found...");
  }
  res.status(200).json(myTicket);
};

const bookTicket = async (req, res) => {
  let userId = req.user._id;

  const { numberOfSeats, couponCode } = req.body;

  if (!numberOfSeats) {
    res.status(409);
    throw new Error("Kindly Select Atleast 1 seat to proceed ");
  }

  //Check if events exists
  const eventId = req.params.eid;

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error("Event not Found");
  }

  //Check if seats available

  if (numberOfSeats > 5) {
    res.status(409);
    throw new Error("only 5 seats Allowed per User");
  }

  if (event.totalSeats < numberOfSeats) {
    res.status(400);
    throw new Error("Seats not Available");
  }

  // check if user have already booked 5 seats

  const myOrders = await Order.find({ event: event._id, user: userId });

  // calculate Total Seats Booked

  let myExistingBookedSeats = myOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((acc, order) => acc + order.seats, 0);

  if (myExistingBookedSeats + parseInt(numberOfSeats) > 5) {
    res.status(400);
    throw new Error(
      `Only 5 seats Allowed per user ! ${5 - myExistingBookedSeats} seats available`,
    );
  }

  //Check if request is coming with Coupon

  let couponExists;
  if (couponCode) {
    couponExists = await Coupon.findOne({ couponCode });

    // if Coupon is valid
    if (!couponExists) {
      res.status(404);
      throw new Error("Invalid Coupon code...");
    }
  }

  const totalBillAmount = couponCode
    ? (event.ticketPrice -
        (event.ticketPrice * couponExists.couponDiscount) / 100) *
      numberOfSeats
    : event.ticketPrice * numberOfSeats;

  //Find User

  const user = await User.findById(userId);

  if (totalBillAmount > user.credits) {
    res.status(409);
    throw new Error(" Not Enough Credits! Please Recharge");
  }

  let order = await Order.create({
    user: req.user.id,
    event: eventId,
    seats: numberOfSeats,
    status: "confirmed",
    isDiscounted: couponCode ? true : false,
    billedAmount: totalBillAmount,
  });

  // Deacrease Available Seats

  let updatedSeats = event.totalSeats - numberOfSeats;

  await Event.findByIdAndUpdate(
    event._id,
    { totalSeats: updatedSeats },
    { new: true },
  );

  // Decrease Credits

  await User.findByIdAndUpdate(
    userId,
    { credits: user.credits - totalBillAmount },
    { new: true },
  );

  if (!order) {
    res.status(409);
    throw new Error("Order Not Accepted");
  }
  res.status(200).json(order);
};

const cancelTicket = async (req, res) => {
  let userId = req.user._id;

  //Find Ticket

  const ticketId = req.params.tid;

  let ticket = await Order.findById(ticketId);

  if (!ticket) {
    res.status(404);
    throw new Error(" Ticket Not Found ...");
  }

  if (ticket.status === "cancelled") {
    res.status(400);
    throw new Error(" Ticket Already Cancelled ...");
  }

  //Find Event
  const event = await Event.findById(ticket.event);

  //Find User
  const user = await User.findById(userId);

  // Check Ticket Status
  if (ticket.status === "expired") {
    res.status(409);
    throw new Error(" Ticket Already Expired ...");
  }

  const now = Date.now();
  const ticketDate = new Date(ticket.createdAt).getTime();
  const elapsedMs = now - ticketDate;
  
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (elapsedMs > SEVEN_DAYS) {
    res.status(400);
    throw new Error("Cannot cancel ticket after 7 days of booking.");
  }

  let refundAmount = ticket.billedAmount;
  let fee = 0;

  if (elapsedMs > ONE_DAY) {
    fee = ticket.billedAmount * 0.1;
    refundAmount = ticket.billedAmount - fee;
  }

  //Increase Seats

  let updatedSeats = event.totalSeats + ticket.seats;

  await Event.findByIdAndUpdate(
    event._id,
    { totalSeats: updatedSeats },
    { new: true },
  );

  // Increase Credits

  await User.findByIdAndUpdate(
    userId,
    { credits: user.credits + refundAmount },
    { new: true },
  );

  const updatedTicket = await Order.findByIdAndUpdate(
    ticket._id,
    { status: "cancelled", cancellationFee: fee },
    { new: true },
  ).populate("event");

  if (!updatedTicket) {
    res.status(409);
    throw new Error(" Ticket Not Cancelled ...");
  }

  res.status(200).json(updatedTicket);
};

const checkCoupon = async (req, res) => {
  const { couponCode } = req.body;
  if (!couponCode) {
    res.status(400);
    throw new Error("Please enter a coupon code");
  }

  const coupon = await Coupon.findOne({ couponCode, isActive: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Invalid or Expired Coupon");
  }

  res.status(200).json(coupon);
};

const orderController = { bookTicket, cancelTicket, getTickets, getTicket, checkCoupon };

export default orderController;
