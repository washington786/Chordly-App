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
  const ownerId = req.user?.id;
  const favorites = await Favorites.find({ owner: ownerId }).populate({
    path: "items",
    populate:{
        path:"owner"
    }
  });
  if (!favorites) {
    return res.status(404).json({ message: "No favorites found" });
  }
  favorites?.items;
  res.status(200).json({ favorites });
});

favorites.get('/is-fav',isAuthenticated,async (req,res)=>{
    const audioId = req.query.audioId;
    if(isValidObjectId(audioId)){
      return res.status(422).json({message:"invalid audio id"})
    }

    const favorite = await Favorites.findOne({owner:req.user?.id, items:audioId});

    res.status(200).json({favorite:favorite?true:false});
});

export default favorites;
