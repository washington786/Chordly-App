import { PageRequestDocument } from "#/@types/misc";
import { isAuthenticated } from "#/middleware/auth/auth";
import { validate } from "#/middleware/vals/validator";
import History, { HistoryDocument, historyType } from "#/models/history";
import { historySchema } from "#/utils/validationSchema";
import { Router } from "express";
import mongoose from "mongoose";

const historyRouter = Router();

historyRouter.post(
  "/",
  isAuthenticated,
  validate(historySchema),
  async (req, res) => {
    try {
      const ownerId = req.user?.id;
      const { progress, date, audio } = req.body;

      let history = await History.findOne({ owner: ownerId });

      const new_history: historyType = {
        audio,
        date,
        progress,
      };

      // If history does not exist, create a new one
      if (!history) {
        history = await History.create({
          owner: ownerId,
          last: new_history,
          all: [new_history],
        });

        return res.status(200).json({ message: "History added successfully!" });
      }

      // Define today's date range
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      // Debugging: Log date range
      console.log("Start:", start.toISOString(), "End:", end.toISOString());

      // Fetch history for today using aggregation
      const userHistory = await History.aggregate([
        { $match: { owner: ownerId } },
        { $unwind: "$all" },
        {
          $match: {
            "all.date": { $gte: start, $lt: end }, // Ensure dates are stored in ISO format
          },
        },
        {
          $project: {
            _id: 0,
            audio: "$all.audio",
          },
        },
      ]);

      // Debugging: Log user history
      console.log("User History Result:", userHistory);

      if (!userHistory.length) {
        console.log("No user history found for today.");
      }

      // Prevent undefined error in find()
      const foundForToday = userHistory.find((item) => {
        return item?.audio && item.audio.toString() === audio;
      });

      if (foundForToday) {
        // Update progress for the existing audio entry
        await History.findOneAndUpdate(
          { owner: ownerId, "all.audio": audio },
          { $set: { "all.$.progress": progress, "all.$.date": date } }
        );
      } else {
        // Ensure `history._id` exists before updating
        if (!history?._id) {
          return res.status(404).json({ message: "History not found" });
        }

        // Add new entry and update last
        await History.findByIdAndUpdate(history._id, {
          $push: { all: { audio, date, progress } },
          $set: { last: new_history },
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating history:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

historyRouter.delete("/", isAuthenticated, async (req, res) => {
  const removeAll = req.query.all === "yes";

  if (removeAll) {
    await History.findOneAndDelete({ owner: req.user?.id });
    return res
      .status(200)
      .json({ message: "All history deleted", success: true });
  }

  const histories = req.query.histories as string;
  const historyIds = JSON.parse(histories) as string[];

  await History.findOneAndUpdate(
    { owner: req.user?.id },
    { $pull: { all: { _id: historyIds } } }
  );

  res
    .status(200)
    .json({ message: "History deleted successfully!", success: true });
});

historyRouter.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const historyId = req.params.id;
    const ownerId = req.user?.id;

    if (!historyId) {
      return res
        .status(400)
        .json({ message: "History ID is required", success: false });
    }

    // Find the user's history document
    const historyDoc = await History.findOne({ owner: ownerId });

    if (!historyDoc) {
      return res
        .status(404)
        .json({ message: "No history found", success: false });
    }

    // Ensure `all` exists and is an array
    if (!Array.isArray(historyDoc.all)) {
      return res
        .status(400)
        .json({ message: "Invalid history structure", success: false });
    }

    // Find index safely
    const entryIndex = historyDoc.all.findIndex(
      (item) => item?._id?.toString() === historyId
    );

    if (entryIndex === -1) {
      return res
        .status(404)
        .json({ message: "History entry not found", success: false });
    }

    // Remove the specific entry
    historyDoc.all.splice(entryIndex, 1);

    // Update `last` if the removed entry was the latest one
    if (historyDoc.last && historyDoc.last._id?.toString() === historyId) {
      historyDoc.last = historyDoc.all.length > 0 ? historyDoc.all[0] : null;
    }

    // Save the updated document
    await historyDoc.save();

    return res
      .status(200)
      .json({ message: "History entry deleted successfully!", success: true });

  } catch (error) {
    console.error("Error deleting history:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});


historyRouter.get("/", isAuthenticated, async (req, res) => {
  try {
    const { limit = "20", pageNo = "1" } = req.query as PageRequestDocument;
    const limitValue = parseInt(limit);
    const skipValue = (parseInt(pageNo) - 1) * limitValue; // Pagination logic

    // Ensure User ID is being received correctly
    console.log("Fetching history for User ID:", req.user?.id);

    const histories = await History.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user?.id) } }, // Ensure correct ID type

      { $unwind: "$all" }, // Expand history entries

      {
        $lookup: {
          from: "audios",
          localField: "all.audio",
          foreignField: "_id",
          as: "audio",
        },
      },

      { $unwind: "$audio" }, // Extract audio details

      {
        $project: {
          _id: 0,
          id: "$all._id",
          audioId: "$audio._id",
          date: "$all.date",
          title: "$audio.title",
        },
      },

      { $sort: { date: -1 } }, // Sort by latest date first

      { $skip: skipValue }, // Pagination
      { $limit: limitValue },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          audios: { $push: "$$ROOT" },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          audios: "$audios",
        },
      },
    ]);

    if (!histories.length) {
      console.log("No histories found for this user.");
    } else {
      console.log("Histories fetched:", histories);
    }

    res.status(200).json({ histories });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

historyRouter.get("/recently-played", isAuthenticated, async (req, res) => {
  const { limit = "10", pageNo = "0" } = req.query as PageRequestDocument;

  const data = await History.aggregate([
    { $match: { owner: req.user?.id } },
    {
      $project: {
        myHistory: {
          $slice: ["$all", parseInt(limit) * parseInt(pageNo), parseInt(limit)],
        },
      },
    },
    {
      $project: {
        histories: {
          $sortArray: { input: "$myHistory", sortBy: { date: -1 } },
        },
      },
    },
    {
      $unwind: { path: "$histories", includeArrayIndex: "index" },
    },
    {
      $lookup: {
        from: "audios",
        localField: "histories.audio",
        foreignField: "_id",
        as: "history",
      },
    },
    {
      $unwind: "$history",
    },
    {
      $lookup: {
        from: "users",
        localField: "history.owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 0,
        id: "$history._id",
        date: "$history.date",
        progress: "$history.progress",
        poster: "$history.poster.url",
        file: "$history.file.url",
        category: "$history.category",
        owner: { name: "$owner.name", id: "$owner._id" },
      },
    },
  ]);

  res.status(200).json({ data });
});

export default historyRouter;
