import { Request } from "express";

export interface createUser extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}


export interface VerifyEmailRequest extends Request {
  body:{
    token: string;
    userId: string;
  }
}

export interface signInUser extends Request {
  body:{
    email: string;
    password: string;
  }
}