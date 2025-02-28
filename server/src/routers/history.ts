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

export default historyRouter;
