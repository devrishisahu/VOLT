import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please Enter Event Title"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Event description"],
    },
    eventImage: {
      type: String,
      required: [true, "Please Enter Event Image URL"],
    },
    eventDate: {
      type: String,
      required: [true, "Please Enter Event Date"],
    },
    eventLocation: {
      type: String,
      required: [true, "Please Enter Event Location"],
    },
    eventArtistName: {
      type: String,
      required: [true, "Please Enter Event Artist Name"],
    },
    totalSeats: {
      type: Number,
      required: [true, "Please Enter Event Seats"],
    },
    duration: {
      type: String,
      required: [true, "Please Enter Event Time Duration"],
    },
    ticketPrice: {
      type: Number,
      required: [true, "Please Enter Event Ticket Price"],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "cancelled", "expired"],
      required: true,
      default: "upcoming",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    genre: {
      type: String,
      enum: ["ROCK", "POP", "EDM", "TECHNO", "HIP HOP"],
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
