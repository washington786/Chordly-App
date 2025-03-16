import { PageRequestDocument } from "#/@types/misc";
import { isAuthenticated } from "#/middleware/auth/auth";
import { isVerified } from "#/middleware/auth/authorization";
import Audio from "#/models/audios";
import Favorites from "#/models/favourites";
import { Router } from "express";
import { isValidObjectId } from "mongoose";

const favorites = Router();

// create favorites
favorites.post("/", isAuthenticated, isVerified, async (req, res) => {
  const { audioId } = req.params;

  let _status: any = "added" | "removed";

  if (!isValidObjectId(audioId)) {
    return res.status(403).json({ message: "invalid audio id" });
  }

  const audio = await Audio.findById(audioId);

  if (!audio) {
    return res.status(404).json({ message: "Sorry, no audio found" });
  }

  // audio is already in favorites

  const favorites = await Favorites.findOne({
    owner: req.user?.id,
    items: audioId,
  });

  if (favorites) {
    await Favorites.updateOne(
      { owner: req.user?.id },
      { $pull: { items: audioId } }
    );
    _status = "removed";
  } else {
    // creating a new favorites list

    const fav = await Favorites.findOne({ owner: req.user?.id });

    if (fav) {
      await Favorites.updateOne(
        { owner: req.user?.id },
        { $addToSet: { items: audioId } }
      );
      status = "added";
    } else {
      // trying to add new audio to old list.
      await Favorites.create({ owner: req.user?.id, items: [audioId] });
    }
    _status = "added";
  }

  if (_status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user?.id },
    });
  }

  if (_status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user?.id },
    });
  }
  res.status(201).json({ message: `Audio ${_status} to favorites` });
});

favorites.get("/", isAuthenticated, isVerified, async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as PageRequestDocument;

  try {
    const _favorites = await Favorites.aggregate([
      { $match: { owner: req.user?.id } },
      {
        $project: {
          audioIds: {
            $slice: [
              "$items", // Corrected from $$items to "$items"
              parseInt(pageNo) * parseInt(limit),
              parseInt(limit),
            ],
          },
        },
      },
      { $unwind: { path: "$audioIds", preserveNullAndEmptyArrays: true } },
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
});

favorites.get("/is-fav", isAuthenticated, async (req, res) => {
  const audioId = req.query.audioId;
  if (isValidObjectId(audioId)) {
    return res.status(422).json({ message: "invalid audio id" });
  }

  const favorite = await Favorites.findOne({
    owner: req.user?.id,
    items: audioId,
  });

  res.status(200).json({ favorite: favorite ? true : false });
});

export default favorites;
