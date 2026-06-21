import CreditRequest from "../models/creditRequestModel.js";
import User from "../models/userModel.js";

// @desc    Create a credit request
// @route   POST /api/credits/request
// @access  Private
const createCreditRequest = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Please enter a valid amount");
    }

    const request = await CreditRequest.create({
        user: req.user._id,
        amount
    });

    res.status(201).json(request);
};

// @desc    Get all credit requests (Admin only)
// @route   GET /api/credits/admin/requests
// @access  Private/Admin
const getAllCreditRequests = async (req, res) => {
    const requests = await CreditRequest.find().populate('user', 'name email');
    res.status(200).json(requests);
};

// @desc    Approve/Reject a credit request (Admin only)
// @route   PUT /api/credits/admin/request/:id
// @access  Private/Admin
const updateCreditRequestStatus = async (req, res) => {
    const { status } = req.body;
    const request = await CreditRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error("Request not found");
    }

    if (status === 'approved' && request.status !== 'approved') {
        const user = await User.findById(request.user);
        user.credits += request.amount;
        await user.save();
    }

    request.status = status;
    await request.save();

    await request.populate('user', 'name email');

    res.status(200).json(request);
};

const getUserCreditRequests = async (req, res) => {
    const requests = await CreditRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
};

const creditController = {
    createCreditRequest,
    getAllCreditRequests,
    updateCreditRequestStatus,
    getUserCreditRequests
};

export default creditController;
