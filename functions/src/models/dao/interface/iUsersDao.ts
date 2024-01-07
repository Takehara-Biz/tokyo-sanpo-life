import { UserDoc } from "../doc/userDoc";

export interface IUsersDao {
  /**
   * to list multiple posts with user info.
   * @param userIds 
   * @returns key is firebaseUserId
   */
  list(userIds: string[]): Promise<Map<string, UserDoc>>
  read(userId: string): Promise<UserDoc | null>;
  create(user: UserDoc): Promise<void>;
  update(user: UserDoc): Promise<void>;
  delete(userId: string): Promise<void>;
}
