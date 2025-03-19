const router = require("express").Router();

const {
  isLoggedIn,
  createComment,
  getComments,
  getReviewComments,
  updateComment,
  deleteComment,
  deleteReview,
} = require("../db");

router.post(
  "/:itemId/reviews/:reviewId/comments",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.user == undefined) {
        res.status(401).send("No user logged in.");
      } else {
        const itemID = req.params.itemId;
        const reviewID = req.params.reviewId;
        const userID = req.user.id;
        const { commentText } = req.body;
        const response = await createComment(
          itemID,
          reviewID,
          commentText,
          userID
        );
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      const userID = req.user.id;
      const response = await getComments(userID);
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

// router.get("/:itemId/comments", isLoggedIn, async (req, res, next) => {
//   try {
//     if (req.user == undefined) {
//       res.status(401).send("No user logged in.");
//     } else {
//       const itemID = req.params.itemId;
//       const response = await getReviewComments(itemID);
//       res.send(response);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:reviewId/comments", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user == undefined) {
      res.status(401).send("No user logged in.");
    } else {
      const reviewID = req.params.reviewId;
      const response = await getReviewComments(reviewID);
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:userId/comments/:commentId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.user == undefined) {
        res.status(401).send("No user logged in.");
      } else {
        const userID = req.params.userId;
        const id = req.params.commentId;
        const { commentText } = req.body;
        const response = await updateComment(userID, id, commentText);
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:userId/comments/:commentId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.user == undefined) {
        res.status(401).send("No user logged in.");
      } else {
        const userID = req.params.userId;
        const id = req.params.commentId;
        const response = await deleteComment(userID, id);
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:userId/reviews/:reviewId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (req.user == undefined) {
        res.status(401).send("No user logged in.");
      } else {
        const userID = req.params.userId;
        const id = req.params.reviewId;
        const response = await deleteReview(userID, id);
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
