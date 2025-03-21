const { prisma } = require("./common");
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) {
    return next();
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT);
    const user = await getUser(id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const createUser = async (username, email, password) => {
  const response = await prisma.User.create({
    data: {
      username,
      email,
      password,
    },
  });
  console.log(response);
  return response;
};

const loginUser = async (email) => {
  const response = await prisma.User.findFirstOrThrow({
    where: {
      email,
    },
  });
  console.log(response);
  return response;
};

const getUser = async (id) => {
  const response = await prisma.User.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      username: true,
      id: true,
      email: true,
    },
  });
  console.log(response);
  return response;
};

const getUserNamesByIds = async (ids) => {
  const response = await prisma.User.findMany({
    where: {
      id: {
        in: ids, // Use 'in' to filter multiple IDs
      },
    },
    select: {
      username: true, // Only select the 'name' field
    },
  });
  console.log(response);
  // Map to extract names only
  const names = response.map((User) => User.username);
  console.log(names);
  return names;
};

const getAllUsers = async () => {
  const response = await prisma.User.findMany({});
  console.log(response);
  return response;
};

const getOneUser = async (id) => {
  const response = await prisma.User.findFirstOrThrow({
    where: {
      id,
    },
  });
  console.log(response);
  return response;
};

const deleteUser = async (id) => {
  const response = await prisma.User.delete({
    where: {
      id,
    },
  });
  console.log(response);
  return response;
};

const updateUser = async (id, username, email, password) => {
  const response = await prisma.User.update({
    where: {
      id,
    },
    data: { username, email, password },
  });
  console.log(response);
  return response;
};

const getItems = async () => {
  const response = await prisma.Item.findMany({});
  console.log(response);
  return response;
};

const getItem = async (id) => {
  const response = await prisma.Item.findFirstOrThrow({
    where: {
      id,
    },
  });
  console.log(response);
  return response;
};

const postAudio = async (id, user, name, description) => {
  const response = await prisma.Item.create({
    data: {
      id,
      user,
      name,
      description,
    },
  });
  console.log(response);
  return response;
};

const getReview = async (itemID) => {
  const response = await prisma.Review.findMany({
    where: {
      itemID,
    },
  });
  console.log(response);
  return response;
};

const getSpecificReview = async (itemID, id) => {
  const response = await prisma.Review.findFirstOrThrow({
    where: {
      itemID,
      id,
    },
  });
  console.log(response);
  return response;
};

const createReview = async (itemID, reviewText, userID) => {
  const response = await prisma.Review.create({
    data: {
      reviewText,
      userID,
      itemID,
    },
  });
  console.log(response);
  return response;
};

const getReviews = async (userID) => {
  const response = await prisma.Review.findMany({
    where: {
      userID,
    },
  });
  console.log(response);
  return response;
};

const updateReview = async (userID, id) => {
  const response = await prisma.Review.update({
    where: {
      id,
      userID,
    },
    data: {
      reviewText,
    },
  });
  console.log(response);
  return response;
};

const createComment = async (itemID, reviewID, commentText, userID) => {
  const response = await prisma.Comment.create({
    data: {
      commentText,
      userID,
      itemID,
      reviewID,
    },
  });
  console.log(response);
  return response;
};

const getComments = async (userID) => {
  const response = await prisma.Comment.findMany({
    where: {
      userID,
    },
  });
  console.log(response);
  return response;
};

const getReviewComments = async (reviewID) => {
  const response = await prisma.Comment.findMany({
    where: {
      reviewID,
    },
  });
  console.log(response);
  return response;
};

const updateComment = async (userID, id, commentText) => {
  const response = await prisma.Comment.update({
    where: {
      id,
      userID,
    },
    data: {
      commentText,
    },
  });
  console.log(response);
  return response;
};

const deleteComment = async (userID, id) => {
  const response = await prisma.Comment.delete({
    where: {
      id,
      userID,
    },
  });
  console.log(response);
  return response;
};

const deleteReview = async (userID, id) => {
  const response = await prisma.Review.delete({
    where: {
      id,
      userID,
    },
  });
  console.log(response);
  return response;
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  getOneUser,
  getUserNamesByIds,
  deleteUser,
  updateUser,
  getItems,
  getItem,
  postAudio,
  getReview,
  getSpecificReview,
  createReview,
  isLoggedIn,
  getReviews,
  updateReview,
  createComment,
  getComments,
  getReviewComments,
  updateComment,
  deleteComment,
  deleteReview,
};
