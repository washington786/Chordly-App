export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: {
    url?: string;
  };
  followers: number[];
  followings: number[];
}
