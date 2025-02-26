const router = require("express").Router();

const { getItems, getItem, getReview } = require("../db");

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

module.exports = router;
