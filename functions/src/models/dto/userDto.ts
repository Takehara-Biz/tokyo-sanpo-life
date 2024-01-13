import { BasicUserIconUtil } from "../dao/basicUserIconUtil";

export type UserDto = {
  /** never changed. desginated by firebase authentication */
  firebaseUserId: string;
  loggedIn: boolean;
  userName: string;
  userIconUrl: string;
  selfIntroduction: string;
  xProfileLink: string;
  instagramProfileLink: string;
  insertedAt: Date;
  updatedAt: Date;
}

/**
 * do not edit properties!
 */
export const leftUser : UserDto = Object.freeze({
  firebaseUserId: "",
  loggedIn: false,
  userName: "退会済みユーザ",
  userIconUrl: BasicUserIconUtil.nonLoggedInUserIconUrl,
  selfIntroduction: "",
  xProfileLink: "",
  instagramProfileLink: "",
  insertedAt: new Date(0),
  updatedAt: new Date(0),
});