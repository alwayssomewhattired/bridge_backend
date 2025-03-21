const router = require("express").Router();

const {
  getItems,
  getItem,
  postAudio,
  getReview,
  isLoggedIn,
} = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const response = await getItems();
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:itemId", async (req, res, next) => {
  try {
    const id = req.params.itemId;
    const response = await getItem(id);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:itemId/reviews", async (req, res, next) => {
  try {
    const itemID = req.params.itemId;
    const response = await getReview(itemID);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/:user/:name", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      const id = req.params.id;
      const user = req.params.user;
      const name = req.params.name;
      const { description } = req.body;
      const response = await postAudio(id, user, name, description);
      console.log(response);
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
