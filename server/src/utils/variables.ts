const {env} = process as {env:{[key:string]:string}};

export const PORT = env.PORT || 8081;
export const URL = env.MONGO_URL as string;
export const USERNAME = env.USERNAME;
export const PASSWORD = env.PASSWORD;
export const RESET_LINK = env.RESET_LINK;
export const JWT_SECRET = env.JWT_SECRET;
export const API_KEY = env.API_KEY;
export const API_SECRET = env.API_SECRET;
export const CLOUD_NAME = env.CLOUD_NAME;
