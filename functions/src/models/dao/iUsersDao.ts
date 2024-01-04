import { IUser } from "../serverTslDef";

export interface IUsersDao {
  read(userId: string): Promise<IUser | null>;
  create(user: IUser): void;
  update(user: IUser): void;
  delete(userId: string): void;
}
