import { Response } from "express";
import { TSLThreadLocal } from "../utils/tslThreadLocal";

export class CtrlUtil{
  public static render(res: Response, view: string, options: object = {}){
    res.render(view, {user: TSLThreadLocal.currentContext.loggedInUser, ...options})
  }
}