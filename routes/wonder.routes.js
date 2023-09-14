const router = require("express").Router();
const mongoose = require("mongoose");
const Wonder = require("../models/Wonder.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/wonder", async (req, res) => {
  try {
    let allWonder = await Wonder.find();
    res.json(allWonder);
  } catch (error) {
    res.json(error);
  }
});

router.get("/wonder/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let foundWonder = await Wonder.findById(id)
      .populate("reviews")
      .populate("visitedBy");
    res.json(foundWonder);
  } catch (error) {
    res.json(error);
  }
});

router.get("/wonder/:id/reviews", async (req, res) => {
  const { id } = req.params;
  try {
    let response = await Review.find({ wonderId: id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    let allUser = await User.find();
    res.json(allUser);
  } catch (error) {
    res.json(error);
  }
});

router.post("/wonder/:id/reviews", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.payload;

  try {
    let newReview = await Review.create({
      content,
      author: user._id,
      wonderId: id,
    });
    await Wonder.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });
    res.json(newReview);
  } catch (error) {
    res.json(error);
  }
});

router.get("/wonder/:id/reviews/:reviewId", async (req, res) => {
  const { reviewId } = req.params;

  try {
    let foundReview = await Review.findById(reviewId);
    res.json(foundReview);
  } catch (error) {
    res.json(error);
  }
});

router.get('/wonder/:userId/reviews', async (req, res) => {
    // check if user did particular review
  const { userId } = req.params;
  try {
    let foundReview = await Reviews.findById(userId);
    res.json(foundReview);
  } catch (error) {
    res.json(error);
  }
});

router.put("/wonder/:id/reviews/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;

  try {
    let updateReview = await Review.findByIdAndUpdate(
      reviewId,
      { content },
      { new: true }
    );
    res.json(updateReview);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/wonder/:id/reviews/:reviewId", async (req, res) => {
  const { reviewId, id } = req.params;

  try {
    await Review.findByIdAndDelete(reviewId);
    await Wonder.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    res.json({ message: "Review Deleted" });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/user/addVisit-wonder/:wonderId",
  isAuthenticated,
  async (req, res) => {
    const { wonderId } = req.params;
    const user = req.payload;
    try {
      let addedVisit = await User.findByIdAndUpdate(user._id, {
        $push: { visitedWonders: wonderId },
      });
      await Wonder.findByIdAndUpdate(wonderId, {
        $push: { visitedBy: user._id },
      });
      res.json(addedVisit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


module.exports = router;