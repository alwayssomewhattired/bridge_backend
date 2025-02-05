const { prisma } = require("./common");
const jwt = require("jsonwebtoken");

const createUser = async (first_name, last_name, email, password) => {
  const response = await prisma.User.create({
    data: {
      first_name,
      last_name,
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
      first_name: true,
      last_name: true,
      id: true,
      email: true,
    },
  });
  console.log(response);
  return response;
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

const updateUser = async (id, first_name, last_name, email, password) => {
  const response = await prisma.User.update({
    where: {
      id,
    },
    data: { first_name, last_name, email, password },
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
  deleteUser,
  updateUser,
};
