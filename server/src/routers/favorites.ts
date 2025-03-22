import { PageRequestDocument } from "#/@types/misc";
import { isAuthenticated } from "#/middleware/auth/auth";
import { isVerified } from "#/middleware/auth/authorization";
import Audio from "#/models/audios";
import Favorites from "#/models/favourites";
import { Request, Response, Router } from "express";
import { isValidObjectId, Types } from "mongoose";

const favorites = Router();

// create favorites
// favorites.post("/", isAuthenticated, isVerified, async (req, res) => {
//   const { audioId } = req.params;

//   let _status: any = "added" | "removed";

//   if (!isValidObjectId(audioId)) {
//     return res.status(403).json({ message: "invalid audio id" });
//   }

//   const audio = await Audio.findById(audioId);

//   if (!audio) {
//     return res.status(404).json({ message: "Sorry, no audio found" });
//   }

//   // audio is already in favorites

//   const favorites = await Favorites.findOne({
//     owner: req.user?.id,
//     items: audioId,
//   });

//   if (favorites) {
//     await Favorites.updateOne(
//       { owner: req.user?.id },
//       { $pull: { items: audioId } }
//     );
//     _status = "removed";
//   } else {
//     // creating a new favorites list

//     const fav = await Favorites.findOne({ owner: req.user?.id });

//     if (fav) {
//       await Favorites.updateOne(
//         { owner: req.user?.id },
//         { $addToSet: { items: audioId } }
//       );
//       status = "added";
//     } else {
//       // trying to add new audio to old list.
//       await Favorites.create({ owner: req.user?.id, items: [audioId] });
//     }
//     _status = "added";
//   }

//   if (_status === "added") {
//     await Audio.findByIdAndUpdate(audioId, {
//       $addToSet: { likes: req.user?.id },
//     });
//   }

//   if (_status === "removed") {
//     await Audio.findByIdAndUpdate(audioId, {
//       $pull: { likes: req.user?.id },
//     });
//   }
//   res.status(201).json({ message: `Audio ${_status} to favorites` });
// });
favorites.post(
  "/:audioId",
  isAuthenticated,
  isVerified,
  async (req: Request, res: Response): Promise<void> => {
    const { audioId } = req.params;

    console.log("Received audioId:", audioId); // Debugging

    if (!isValidObjectId(audioId)) {
      res.status(403).json({ message: "invalid audio id" });
      return;
    }

    try {
      const audio = await Audio.findById(audioId);

      if (!audio) {
        res.status(404).json({ message: "Sorry, no audio found" });
        return;
      }

      // Check if audio is already in favorites
      const favorites = await Favorites.findOne({
        owner: req.user?.id,
        items: audioId,
      });

      let _status = "added";

      if (favorites) {
        await Favorites.updateOne(
          { owner: req.user?.id },
          { $pull: { items: audioId } }
        );
        _status = "removed";
      } else {
        const fav = await Favorites.findOne({ owner: req.user?.id });

        if (fav) {
          await Favorites.updateOne(
            { owner: req.user?.id },
            { $addToSet: { items: audioId } }
          );
        } else {
          await Favorites.create({ owner: req.user?.id, items: [audioId] });
        }
        _status = "added";
      }

      if (_status === "added") {
        await Audio.findByIdAndUpdate(audioId, {
          $addToSet: { likes: req.user?.id },
        });
      } else {
        await Audio.findByIdAndUpdate(audioId, {
          $pull: { likes: req.user?.id },
        });
      }

      res.status(201).json({ message: `Audio ${_status} to favorites` });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

favorites.get(
  "/",
  isAuthenticated,
  isVerified,
  async (req: Request, res: Response): Promise<void> => {
    let { limit = "20", pageNo = "1" } = req.query as PageRequestDocument;

    // Convert pageNo and limit to numbers
    const pageNumber = parseInt(pageNo as any, 10);
    const limitNumber = parseInt(limit as any, 10);

    try {
      const _favorites = await Favorites.aggregate([
        {
          $match: { owner: new Types.ObjectId(req.user?.id) }, // Ensure ObjectId match
        },
        {
          $project: {
            audioIds: {
              $slice: [
                "$items",
                (pageNumber - 1) * limitNumber, // Correct offset calculation
                limitNumber,
              ],
            },
          },
        },
        { $unwind: { path: "$audioIds", preserveNullAndEmptyArrays: true } }, // Preserve empty lists
        {
          $lookup: {
            from: "audios",
            localField: "audioIds",
            foreignField: "_id",
            as: "audioInfo",
          },
        },
        { $unwind: { path: "$audioInfo", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "audioInfo.owner",
            foreignField: "_id",
            as: "ownerInfo",
          },
        },
        { $unwind: { path: "$ownerInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            id: "$audioInfo._id",
            title: "$audioInfo.title",
            about: "$audioInfo.about",
            file: "$audioInfo.file.url",
            poster: "$audioInfo.poster.url",
            owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
          },
        },
      ]);

      res.status(200).json({ audios: _favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


favorites.get(
  "/is-fav",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const audioId = req.query.audioId;
    if (isValidObjectId(audioId)) {
      res.status(422).json({ message: "invalid audio id" });
      return;
    }

    const favorite = await Favorites.findOne({
      owner: req.user?.id,
      items: audioId,
    });

    res.status(200).json({ favorite: favorite ? true : false });
  }
);

export default favorites;
