export type AuthPropTypes = {
  signUp: undefined;
  signIn: undefined;
  resetPassword: undefined;
  verification: {
    userInfo: {
      _id: string;
      email: string;
      name: string;
    };
    message: string;
  };
  app: undefined;
  auth: undefined;
  upload: undefined;
  home: undefined;
  profile: undefined;
};

export type profilePropTypes = {
  profile: undefined;
  settings: undefined;
};
