import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice";
import event from "./event/eventSlice";
import order from "./order/orderSlice";
import chat from "./chat/chatSlice";
import admin from "./admin/adminSlice";
import creditReducer from "./credits/creditSlice";

const store = configureStore({
  reducer: { auth, event, order, chat, admin, credits: creditReducer },
});

export default store;
