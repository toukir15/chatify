/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { catchAsync } from "../../utils/createAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const result = await userServices.createUserIntoDB(userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const result = await userServices.getUsersFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrived successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.body.id;
  const result = await userServices.updateUserIntoDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrived successfully!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getUsers,
  updateUser,
};
