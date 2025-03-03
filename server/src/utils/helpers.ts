import History from "#/models/history";
import { Request } from "express";
import moment from "moment";

export const getUserHistory = async (req: Request): Promise<string[]> => {
  const [result] = await History.aggregate([
    { $match: { owner: req.user?.id } },
    { $unwind: "$all" },
    //   match records <30days
    {
      $match: {
        "all.date": { $gte: moment().subtract(10, "days").toDate() },
      },
    },
    { $group: { _id: "$all.audio" } },
    {
      $lookup: {
        from: "audios",
        foreignField: "_id",
        localField: "_id",
        as: "audio",
      },
    },
  ]);

  if (result) {
    return result.category;
  }

  return [];
};
