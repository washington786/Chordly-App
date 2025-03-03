import { isAuthenticated } from "#/middleware/auth/auth";
import { isVerified } from "#/middleware/auth/authorization";
import { validate } from "#/middleware/vals/validator";
import Audio from "#/models/audios";
import Playlist from "#/models/playlist";
import {
  OldPlaylistValidationSchema,
  PlaylistValidationSchema,
} from "#/utils/audioValidationSchema";
import { Request, Router } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
// import playlist from "../models/"

const playlistRouter = Router();

interface CreatePlaylistDoc extends Request {
  body: {
    title: string;
    // owner: string;
    resourceId: ObjectId;
    visibility: "public" | "private";
  };
}

interface UpdatePlaylistDoc extends Request {
  body: {
    title: string;
    items: string;
    id: ObjectId;
    visibility: "public" | "private";
  };
}

playlistRouter.post(
  "/create",
  isAuthenticated,
  isVerified,
  validate(PlaylistValidationSchema),
  async (req: CreatePlaylistDoc, res) => {
    const { title, resourceId, visibility } = req.body;
    const ownerId = req.user?.id;

    if (resourceId) {
      const audio = await Audio.findById(resourceId);

      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }
    }

    const newPlaylist = new Playlist({ title, owner: ownerId, visibility });

    if (resourceId) {
      newPlaylist.items = [resourceId];
    }

    await newPlaylist.save();

    res.status(201).json(newPlaylist);
  }
);

playlistRouter.patch(
  "/",
  isAuthenticated,
  isVerified,
  validate(OldPlaylistValidationSchema),
  async (req: UpdatePlaylistDoc, res) => {
    const { visibility, title, id, items } = req.body;
    const ownerId = req.user?.id as ObjectId;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.body.id, owner: ownerId },
      { title, visibility },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "playlist not found!" });
    }

    if (items) {
      const audio = await Audio.findById(items);
      if (audio) {
        return res.status(200).json({ message: "audio not found." });
      }
      // playlist.items.push(id);
      // await playlist.save();
      await Playlist.findByIdAndUpdate(playlist.id, {
        $addToSet: { items: items },
      });
    }

    res.status(200).json(playlist);
  }
);

playlistRouter.delete("/", isAuthenticated, async (req, res) => {
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ message: "Invalid playlist id" });
  }

  if (all === "yes") {
    const playlist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: req.user?.id,
    });

    if (!playlist)
      return res.status(404).json({ message: "no playlist found" });
  }

  if (resId) {
    if (!isValidObjectId(resId)) {
      return res.status(422).json({ message: "Invalid audio id" });
    }
    const lst = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: req.user?.id },
      { $pull: { items: resId } }
    );
    if (!lst) return res.status(404).json({ message: "No such playlist" });
  }
  res
    .status(200)
    .json({ message: "Resource removed successfully", success: true });
});

playlistRouter.get("/by-profile", isAuthenticated, async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const ownerId = req.user?.id;

  const playlist = await Playlist.find({
    owner: ownerId,
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const response = playlist.map((item) => {
    const { _id, title, items, visibility } = item;
    return {
      id: _id,
      title: title,
      items: items,
      itemsCount: items.length,
      visibility: visibility,
    };
  });
  if (!playlist) return res.status(404).json({ message: "no playlist found" });

  res.status(200).json(response);
});

playlistRouter.get("/:playlistId", isAuthenticated, async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ message: "Invalid playlist id" });
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user?.id,
  }).populate({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) {
    return res.status(404).json({ message: "no playlist" });
  }

  const audios = playlist.items.map((item_audio) => {
    const { _id, title, about, category, file, poster, owner } = item_audio;
    return {
      id: _id,
      title: title,
      about: about,
      category: category,
      file: file?.url,
      poster: poster?.url,
      owner: owner,
    };
  });

  res.status(200).json(audios);
});


export default playlistRouter;
