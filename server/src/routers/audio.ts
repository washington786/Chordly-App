import { isAuthenticated } from "#/middleware/auth/auth";
import { isVerified } from "#/middleware/auth/authorization";
import { fileParse } from "#/middleware/FormidableUpload";
import { validate } from "#/middleware/vals/validator";
import { audioValidationSchema } from "#/utils/audioValidationSchema";
import { Router } from "express";
import { RequestWithFiles } from "./auth";
import { CategoryTypes } from "#/utils/audio_categories";
import formidable from "formidable";
import cloudinary from "#/utils/cloud";
import Audio from "#/models/audios";

const audio = Router();

interface createAudio extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: CategoryTypes;
  };
}

audio.post(
  "/create",
  isAuthenticated,
  isVerified,
  fileParse,
  validate(audioValidationSchema),
  async (req: createAudio, res) => {
    const { title, about, category } = req.body;

    const poster = req.files?.poster as formidable.File;
    const audioFile = req.files?.file as formidable.File;

    const ownerId = req.user?.id;

    if (!audioFile) {
      return res.status(422).json({ error: "Please upload an audio file" });
    }

    // resource type becomes video as there's no audio type.
    const audioUpload = await cloudinary.uploader.upload(audioFile.filepath, {
      resource_type: "video",
    });

    const audio = new Audio({
      title,
      about,
      category,
      owner: ownerId,
      file: { url: audioUpload.url, publicId: audioUpload.public_id },
    });

    if (poster) {
      const posterUpload = await cloudinary.uploader.upload(poster.filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });
      audio.poster = {
        url: posterUpload.url,
        publicId: posterUpload.public_id,
      };
    }

    await audio.save();
    res.status(201).json({ audio, message: "uploaded successfully" });
  }
);

audio.patch(
  "/update-audio/:audioId",
  isAuthenticated,
  isVerified,
  fileParse,
  async (req: createAudio, res) => {
    const poster = req.files?.poster as formidable.File;

    const { title, about, category } = req.body;

    const { audioId } = req.params;
    const ownerId = req.user?.id;

    const audioFound = await Audio.findOne(
      { _id: audioId, owner: ownerId }
    );

    if (!audioFound) {
      return res.status(404).json({ error: "Audio not found" });
    }

    if (poster) {
      if (audioFound.poster.publicId) {
        await cloudinary.uploader.destroy(audioFound.poster.publicId);
      }

      const posterResponse = await cloudinary.uploader.upload(poster.filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      audioFound.poster = {
        url: posterResponse.url,
        publicId: posterResponse.public_id,
      };
    }

    audioFound.title = title;
    audioFound.about = about;
    audioFound.category = category;

    await audioFound.save();

    res.status(200).json({ message: "Audio updated successfully", audioFound });
  }
);

export default audio;
