import Comment from "../models/commentModel.js";
import Event from "../models/eventModel.js";

const getComments = async (req, res) => {
  const eventId = req.params.eid;

  const comments = await Comment.find({ event: eventId })
    .populate("user")
    .populate("event");

  if (!comments) {
    res.status(404);
    throw new Error("No Comments Yet!");
  }
  res.status(200).json(comments);
};

const addComment = async (req, res) => {
  const { text, rating } = req.body;

  if (!text || !rating) {
    res.status(404);
    throw new Error("Please Fill All The Details!");
  }

  const eventId = req.params.eid;
  const userId = req.user._id;

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error("Event Not Found!");
  }

  const newComment = new Comment({
    user: userId,
    event: eventId,
    text: text,
    rating: rating,
  });

  await newComment.save();
  await (await newComment.populate("user")).populate("event");

  if (!newComment) {
    res.status(409);
    throw new Error("Comment not Created!");
  }
  res.status(200).json(newComment);
};

const deleteComment = async (req, res) => {
  const commentId = req.params.cid;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment Not Found!");
  }

  // Ensure user owns comment or is admin
  if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not Authorized to delete this comment");
  }

  await comment.deleteOne();
  res.status(200).json({ id: commentId });
};

const commentController = { getComments, addComment, deleteComment };

export default commentController;
