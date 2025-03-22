import { isAuthenticated } from "#/middleware/auth/auth";
import { isVerified } from "#/middleware/auth/authorization";
import { validate } from "#/middleware/vals/validator";
import Audio from "#/models/audios";
import Playlist from "#/models/playlist";
import {
  OldPlaylistValidationSchema,
  PlaylistValidationSchema,
} from "#/utils/audioValidationSchema";
import { Request, Response, Router } from "express";
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
  async (req: CreatePlaylistDoc, res: Response): Promise<void> => {
    const { title, resourceId, visibility } = req.body;
    const ownerId = req.user?.id;

    if (resourceId) {
      const audio = await Audio.findById(resourceId);

      if (!audio) {
        res.status(404).json({ error: "Audio not found" });
        return;
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
  async (req: UpdatePlaylistDoc, res: Response): Promise<void> => {
    const { visibility, title, id, items } = req.body;
    const ownerId = req.user?.id;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { title, visibility },
      { new: true }
    );

    if (!playlist) {
      res.status(404).json({ message: "playlist not found!" });
      return;
    }

    if (items) {
      const audio = await Audio.findById(items);
      if (audio) {
        res.status(200).json({ message: "audio not found." });
        return;
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

playlistRouter.delete(
  "/",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const { playlistId, resId, all } = req.query;

    if (!isValidObjectId(playlistId)) {
      res.status(422).json({ message: "Invalid playlist id" });
      return;
    }

    if (all === "yes") {
      const playlist = await Playlist.findByIdAndDelete({
        _id: playlistId,
        owner: req.user?.id,
      });

      if (!playlist) res.status(404).json({ message: "no playlist found" });
      return;
    }

    if (resId) {
      if (!isValidObjectId(resId)) {
        res.status(422).json({ message: "Invalid audio id" });
        return;
      }
      const lst = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user?.id },
        { $pull: { items: resId } }
      );
      if (!lst) {
        res.status(404).json({ message: "No such playlist" });
        return;
      }
    }
    res
      .status(200)
      .json({ message: "Resource removed successfully", success: true });
  }
);

playlistRouter.get(
  "/by-profile",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
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
    if (!playlist) {
      res.status(404).json({ message: "no playlist found" });
      return;
    }

    res.status(200).json(response);
  }
);

playlistRouter.get(
  "/:playlistId",
  isAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
      res.status(422).json({ message: "Invalid playlist id" });
      return;
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
      res.status(404).json({ message: "no playlist" });
      return;
    }

    const audios = playlist.items.map((item_audio) => {
      const { _id, title, about, category, file, poster, owner } =
        item_audio as any;
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
  }
);

export default playlistRouter;
