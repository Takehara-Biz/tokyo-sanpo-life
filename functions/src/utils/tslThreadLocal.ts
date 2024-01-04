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
  public readonly requestId: string;
  
  constructor(){
    this.requestId = TSLThreadLocal.generateRandomString(4);
  }

  static get currentContext(): TSLThreadLocal {
    return this.storage.getStore()!;
  }

  private static generateRandomString(charCount: number): string {
    const useChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = Math.floor(Math.random() * charCount);
    let result = "";
    for (let i = 0; i < strLength; i++) {
      result += useChar.charAt(Math.floor(Math.random() * useChar.length));
    }
    return result;
  }
}