export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: {
    url?: string;
    id?: string;
  };
  followers: number[];
  followings: number[];
}
interface Avatar {
  public_id: string;
  url: string;
}

export interface UserProfiles {
  __v: number;
  _id: string;
  avatar: Avatar;
  createdAt: string; // ISO date string
  email: string;
  favorites: string[]; // Assuming IDs of favorite items
  followers: string[]; // User IDs
  followings: string[]; // User IDs
  name: string;
  password: string; // Hashed password
  tokens: string[]; // JWT tokens
  updatedAt: string; // ISO date string
  verified: boolean;
}

