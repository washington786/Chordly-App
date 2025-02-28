import { Model, model, models, ObjectId, Schema } from "mongoose";

export interface FavouriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}

const favoriteSchema = new Schema<FavouriteDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [Schema.Types.ObjectId],
      ref: "Audio",
      required: true,
    },
  },
  { timestamps:true }
);

const Favorites = models.Favorites || model("Favorite", favoriteSchema);

export default Favorites as Model<FavouriteDocument>;
