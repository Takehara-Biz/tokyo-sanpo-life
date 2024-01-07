import { BasicUserIconUtil } from "../dao/basicUserIconBase64";

export type UserDto = {
  /** never changed. desginated by firebase authentication */
  firebaseUserId: string;
  loggedIn: boolean;
  userName: string;
  userIconBase64: string;
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
  userIconBase64: BasicUserIconUtil.nonLoggedInUserIconBase64,
  selfIntroduction: "",
  xProfileLink: "",
  instagramProfileLink: "",
  insertedAt: new Date(0),
  updatedAt: new Date(0),
});