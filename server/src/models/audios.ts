import { categories, CategoryTypes } from "#/utils/audio_categories";
import { Model, model, models, Schema } from "mongoose";
import { ObjectId } from "mongoose";

export interface AudioDocument {
  title: string;
  about: string;
  owner: ObjectId;
  file: {
    url: string;
    publicId: string;
  };
  poster: {
    url: string;
    publicId: string;
  };
  // duration:number;
  likes: ObjectId[];
  category: CategoryTypes;
  createdAt:Date;
}

const AudioSchema = new Schema<AudioDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: Object,
      url: String,
      public_id: String,
    },
    poster: {
      type: Object,
      url: String,
      public_id: String,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    category: {
      type: String,
      enum: Object.values(categories),
      default: "Others",
    },
  },
  { timestamps: true }
);

const Audio = models.Audio || model("Audio", AudioSchema);

export default Audio as Model<AudioDocument>;
