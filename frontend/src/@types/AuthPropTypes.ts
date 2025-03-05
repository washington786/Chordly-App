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
};
