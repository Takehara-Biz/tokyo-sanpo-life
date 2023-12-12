import { ServerDummyData } from './serverDummyData'
import { IPost } from './serverTslDef';

export class BizLogic {
  public findPosts(): IPost[] {
    return ServerDummyData;
  }
}