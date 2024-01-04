import { IUser } from "../serverTslDef";

export interface IUsersDao {
  read(userId: string): Promise<IUser | null>;
  create(user: IUser): Promise<void>;
  update(user: IUser): Promise<void>;
  delete(userId: string): Promise<void>;
}
