import { Response } from "express";
import { ResponseData } from "@/interfaces/response.interface";

export const success = (res: Response, code: number, message: string, data?: Object): Response => {
  const responseData: ResponseData = {
    message,
    status: "Success",
    code,
    data,
  };

  return res.status(code).json(responseData);
};

export const failure = (res: Response, code: number, message: string, data?: Object): Response => {
  const responseData: ResponseData = {
    message,
    status: "Failure",
    code,
    data,
  };

  return res.status(code).json(responseData);
};