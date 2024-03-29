const ExerciseUser = require("../models/exercise-user.model");
const isAuthenticated = require("../middleware/is-authenticated");
const ExerciseType = require("../models/exercise-type.model");

const router = require("express").Router();

// Get all exercise-user by his ID

router.get("/", async (req, res, next) => {
  try {
    const exerciseUsers = await ExerciseUser.find({
      owner: req.user._id,
    }).populate("type");
    res.json(exerciseUsers);
  } catch (error) {
    next(error);
  }
});

// Get one exercise-user by his ID

router.get("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id, req.user._id);
    const oneExerciseUser = await ExerciseUser.findOne({
      owner: req.user._id,
      _id: req.params.id,
    }).populate("type");

    if (!oneExerciseUser) {
      return res
        .status(400)
        .json({ message: "User Exercise - Unauthorized or not found" });
    }
    res.json(oneExerciseUser);
  } catch (error) {
    next(error);
  }
});

// Create an exercise-user

router.post("/", async (req, res, next) => {
  try {
    const { type, weight, rep } = req.body;
    const createExerciseUser = await ExerciseUser.create({
      date: new Date(),
      type,
      weight: weight,
      rep: rep,
      owner: req.user._id,
    });
    res.status(201).json({ id: createExerciseUser._id });
  } catch (error) {
    next(error);
  }
});

// Update an exercise-user

router.put("/:id", async (req, res, next) => {
  try {
    console.log("REQ BODY 👋", req.body);
    const { type, weight, rep } = req.body;

    if (!type || !weight || !rep) {
      return res
        .status(400)
        .json({ message: "Trying to update - Missing fields" });
    }

    if (weight.length !== rep.length) {
      return res
        .status(400)
        .json({ message: "Trying to update - Weight and Rep not matching" });
    }

    const updateExerciseUser = await ExerciseUser.findOneAndUpdate(
      { _id: req.params.id },
      {
        type,
        weight,
        rep,
      },
      { new: true }
    );
    res.status(202).json(updateExerciseUser);
  } catch (error) {
    next(error);
  }
});

// Delete an exercise-user

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteExerciseUser = await ExerciseUser.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deleteExerciseUser) {
      return res.status(401).json({
        message: "Trying to delete Exercise User - Unauthorized or not found",
      });
    }
    res.status(204).json(deleteExerciseUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
