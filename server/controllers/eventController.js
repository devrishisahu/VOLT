import fs from "node:fs"
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js";
import Event from "../models/eventModel.js"

const createEvent = async (req, res) => {

  const {title , description , eventDate , eventLocation , eventArtistName , totalSeats , duration , ticketPrice, genre } = req.body;

  if (!title || !description || !eventDate || !eventLocation || !eventArtistName || !totalSeats || !duration || !ticketPrice ) {

    res.status(409)
    throw new Error("Please fill all the details ")
    
  }


  //Upload Image To Cloudinary
  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(req.file.path);
  } finally {
    // remove from Server
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
  // Create event
  const newEvent = await Event.create({ 
    user: req.user._id, 
    title, 
    description, 
    eventDate, 
    eventLocation, 
    eventArtistName, 
    totalSeats, 
    duration, 
    ticketPrice, 
    genre,
    eventImage: uploadResult.secure_url,
    isActive: req.user.isAdmin // Auto-approve if submitted by an admin
  });
  if(!newEvent){
    res.status(400)
    throw new Error("Event not Created")
  }
  res.status(201).json(newEvent)


};


//Get Events

const getEvents = async (req,res) => {

//Find Events
const events = await Event.find()

if(!events){
  res.status(404)
  throw new Error("Events not Found..")
}

const activeEvents = events.filter(event => event.isActive)
res.status(200).json(activeEvents)

}


//Get Event

const getEvent = async (req,res) => {

//Find Event
const event = await Event.findById(req.params.eid)

if(!event){
  res.status(404)
  throw new Error("Event not Found..")
}

if(!event.isActive) {
  res.status(404)
  throw new Error("Event is Not Active Yet..")
}


res.status(200).json(event)

}



// Get My Events
const getMyEvents = async (req, res) => {
  const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(events);
}

const eventController = { createEvent , getEvents , getEvent, getMyEvents };

export default eventController;
