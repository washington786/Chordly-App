import { PageRequestDocument } from "#/@types/misc";
import { isAuthenticated } from "#/middleware/auth/auth";
import { validate } from "#/middleware/vals/validator";
import History, { HistoryDocument, historyType } from "#/models/history";
import { historySchema } from "#/utils/validationSchema";
import { Router } from "express";

const historyRouter = Router();

historyRouter.post(
  "/",
  isAuthenticated,
  validate(historySchema),
  async (req, res) => {
    // utilizing aggregation pipelines
    const ownerId = req.user?.id;

    const { progress, date, audio } = req.body;

    const history = await History.findOne({ owner: ownerId });

    const new_history: historyType = {
      audio,
      date,
      progress,
    };

    if (!history) {
      await History.create({
        owner: ownerId,
        last: new_history,
        all: [new_history],
      });

      return res.status(200).json({ message: "history added successfully!" });
    }

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

    const userHistory = await History.aggregate([
      {
        $match: { owner: ownerId },
      },
      { $unwind: "$all" },
      {
        $match: {
          "all.date": {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $project: {
          _id: 0,
          audio: "$all.audio",
        },
      },
    ]);

    const foundForToday = userHistory.find((item) => {
      if (item.audio.toString() === audio) {
        return item;
      }
    });

    if (foundForToday) {
      await History.findOneAndUpdate(
        { owner: ownerId, "all.audio": audio },
        { $set: { "all.$.progress": progress, "all.$.date": date } }
      );
    } else {
      await History.findByIdAndUpdate(history._id, {
        $push: { all: { $each: [userHistory], $position: 0 } },
        $set: { last: userHistory },
      });
    }

    res.status(200).json({ success: true });
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

historyRouter.get("/", isAuthenticated, async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as PageRequestDocument;
  const histories = await History.aggregate([
    { $match: { owner: req.user?.id } },
    {
      $project: {
        all: {
          $slice: ["$all", parseInt(limit) * parseInt(pageNo), parseInt(limit)],
        },
      },
    },
    { $unwind: "$all" },
    {
      $lookup: {
        from: "audios",
        localField: "all.audio",
        foreignField: "_id",
        as: "audio",
      },
    },
    { $unwind: "$audio" },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        audioId: "$audio._id",
        date: "$all.date",
        title: "$audio.title",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%y-%m-%d", date: "$date" } },
        audios: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$id",
        date: "$_id",
        audios: "$$ROOT.audios",
      },
    },
    { $sort: { date: -1 } },
  ]);

  res.status(200).json({ histories });
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
