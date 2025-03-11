const {
  getSpecificReview,
  createReview,
  isLoggedIn,
  getReviews,
  updateReview,
} = require("../db");

const router = require("express").Router();

router.get("/:itemId/reviews/:reviewId", async (req, res, next) => {
  try {
    const itemID = req.params.itemId;
    const id = req.params.reviewId;
    console.log(req.params.reviewId)
    const response = await getSpecificReview(itemID, id);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/:itemId/reviews", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      const itemID = req.params.itemId;
      const userID = req.user.id;
      const { reviewText } = req.body;

      const response = await createReview(itemID, reviewText, userID);
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      // make function for this
      const userID = req.user.id;
      const response = await getReviews(userID);
      res.status(200).send(response);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:userId/reviews/:reviewId", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      const userID = req.params.userId;
      const id = req.params.reviewId;
      const { reviewText } = req.body;
      console.log(userID);
      const response = await updateReview(userID, id);
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
