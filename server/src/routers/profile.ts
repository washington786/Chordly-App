import { PageRequestDocument } from "#/@types/misc";
import { isAuthenticated } from "#/middleware/auth/auth";
import Audio from "#/models/audios";
import Playlist from "#/models/playlist";
import users from "#/models/users";
import { Router } from "express";
import { isValidObjectId } from "mongoose";

const profileRouter = Router();

profileRouter.post(
  "/update-followers/:followerId",
  isAuthenticated,
  async (req, res) => {
    const { followerId } = req.params;

    let status: "added" | "removed";

    if (!isValidObjectId(followerId)) {
      return res.status(403).json({ message: "Invalid follower id" });
    }

    const user = await users.findById(followerId);

    if (!user) {
      return res.status(404).json({ message: "not found." });
    }

    const alreadyFollower = await users.findOne({
      _id: followerId,
      followers: req.user?.id,
    });

    if (alreadyFollower) {
      await users.updateOne(
        { _id: followerId },
        { $pull: { followers: req.user?.id } }
      );
      status = "removed";
    } else {
      await users.updateOne(
        { _id: followerId },
        { $addToSet: { followers: req.user?.id } }
      );
      status = "added";
    }

    if (status === "added") {
      await users.updateOne(
        { _id: req.user?.id },
        { $addToSet: { followings: followerId } }
      );
    }

    if (status === "removed") {
      await users.updateOne(
        { _id: req.user?.id },
        { $pull: { followings: followerId } }
      );
    }

    res.status(200).json({ message: `${status}` });
  }
);

profileRouter.get("/uploads", isAuthenticated, async (req, res) => {
  const ownerId = req.user?.id;

  const { pageNo = "0", limit = "20" } = req.query as PageRequestDocument;

  const uploads = await Audio.find({ owner: ownerId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = uploads.map((item) => {
    const { _id, title, about, file, poster, createdAt, owner } = item;
    return {
      id: _id,
      title,
      about,
      file: file.url,
      poster: poster.url,
      date: createdAt,
      owner: owner,
    };
  });

  res.status(200).json({ audios });
});
profileRouter.get("/uploads/:profileId", isAuthenticated, async (req, res) => {
  const { profileId } = req.params;

  const { pageNo = "0", limit = "20" } = req.query as PageRequestDocument;

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ message: "Invalid profile id" });
  }

  const uploads = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = uploads.map((item) => {
    const { _id, title, about, file, poster, createdAt, owner } = item;
    return {
      id: _id,
      title,
      about,
      file: file.url,
      poster: poster.url,
      date: createdAt,
      owner: owner,
    };
  });

  res.status(200).json({ audios });
});

profileRouter.get(
  "/profileInfo/:profileId",
  isAuthenticated,
  async (req, res) => {
    const { profileId } = req.params;

    if (!isValidObjectId(profileId)) {
      return res.status(422).json({ message: "Invalid profile id" });
    }

    const userProfile = await users.findById(profileId);

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { _id, name, followers, avatar } = userProfile;

    res.status(200).json({
      profile: {
        id: _id,
        name,
        followers: followers.length,
        avatar: avatar?.url,
      },
    });
  }
);

profileRouter.get(
  "/publicPlaylist/:playlistId",
  isAuthenticated,
  async (req, res) => {
    const { playlistId } = req.params;

    const { limit = "20", pageNo = "0" } = req.query as PageRequestDocument;

    if (!isValidObjectId(playlistId)) {
      return res.status(422).json({ message: "Invalid profile id" });
    }

    const playlist = await Playlist.find({
      owner: playlistId,
      visibility: "public",
    })
      .skip(parseInt(limit) * parseInt(pageNo))
      .limit(parseInt(limit))
      .sort("-createdAt");

    if (!playlist) {
      return res.status(404).json({ playlist: [] });
    }

    const items = playlist.map((lst) => {
      const { _id, title, visibility, items } = lst;
      return { id: _id, title: title, visibility, items: items.length };
    });

    res.status(200).json({
      playlist: items,
    });
  }
);

export default profileRouter;
