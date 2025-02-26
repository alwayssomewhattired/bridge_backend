const { prisma } = require("./common");

async function seed() {
  const deleteEverything = await prisma.User.deleteMany({});
  const deleteEverythingItems = await prisma.Item.deleteMany({});

  const zach = await prisma.User.create({
    data: {
      username: "zach",
      email: "zacharymalinka@gmail.com",
      password: "malinka",
    },
  });

  const ned = await prisma.User.create({
    data: {
      username: "ned",
      email: "nedflanders@hotmail.com",
      password: "flanders",
    },
  });

  const burger = await prisma.Item.create({
    data: {
      name: "burger",
    },
  });

  const shake = await prisma.Item.create({
    data: {
      name: "shake",
    },
  });

  const rev = await prisma.Review.create({
    data: {
      reviewText: "These fries are so good",
      userID: zach.id,
      itemID: burger.id,
    },
  });

  const com = await prisma.comment.create({
    data: {
      commentText: "same!",
      userID: zach.id,
      itemID: burger.id,
      reviewID: rev.id,
    },
  });
}
seed();

module.exports = seed;
