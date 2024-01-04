import { AsyncLocalStorage } from 'async_hooks';
import { IUser } from '../models/serverTslDef';

/**
 * Manage thread local data.
 * 
 * Reference
 * https://tech.emotion-tech.co.jp/entry/async-local-storage
 */
export class TSLThreadLocal {
  static storage = new AsyncLocalStorage<TSLThreadLocal>();
  public identifiedFirebaseUserId: string | undefined;
  public loggedInUser: IUser | undefined;

  static get currentContext(): TSLThreadLocal {
    return this.storage.getStore()!;
  }

}