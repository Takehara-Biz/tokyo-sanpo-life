import { TslLogUtil } from "../../utils/tslLogUtil";
import {IPost, IPostComment, PostCategory} from "../serverTslDef";
import { DaoUtil } from "./daoUtil";

export class PostsDao {
  private idAndPostMap: Map<string, IPost> = new Map<string, IPost>();
  private idSequence: number;

  constructor(postCount: number) {
    this.generateRandomPosts(postCount);
    this.idSequence = postCount - 1;
  }

  private generateRandomPosts(postCount: number): void {
    const commentsCount = 10;
    const comments: IPostComment[] = this.createRandomComments(commentsCount);
    for (let i = 0; i < postCount; i++) {
      const post = {
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: DaoUtil.generateRandomString(3, 12),
          iconUrl: "/images/user-icon/kkrn_icon_user_9.svg",
        },
        postCategory: this.chooseContentTypeEnumRandomly(),
        imageUrl: "/images/post-sample.jpeg",
        lat: 35.2 + (Math.random()),
        lng: 139.3 + (Math.random()),
        description: DaoUtil.generateRandomString(1, 100),
        insertDate: new Date("2023/12/01"),
        postComments: comments,
      };
      this.idAndPostMap.set(i.toString(), post);
    }
  }

  private createRandomComments(count: number): IPostComment[] {
    const comments: IPostComment[] = [];
    for (let i = 0; i < count; i++) {
      comments.push({
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: DaoUtil.generateRandomString(3, 12),
          iconUrl: "/images/user-icon/kkrn_icon_user_9.svg",
        },
        comment: DaoUtil.generateRandomString(1, 100),
        commentDate: new Date("2023/12/01"),
      },);
    }
    return comments;
  }

  private chooseContentTypeEnumRandomly(): PostCategory {
    const index = Math.floor(Math.random() * PostCategory.Categories.length);
    return PostCategory.Categories[index];
  }

  private nextval(): number {
    return ++this.idSequence;
  }

  public findPosts(): IPost[] {
    const result = [...this.idAndPostMap.values()]
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = [...this.idAndPostMap.values()].filter((value: IPost) => value.user.id === userId);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = this.idAndPostMap.get(id) ?? null;
    TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost):void {
    post.id = this.nextval().toString();
    TslLogUtil.info('createPost : ' + JSON.stringify(post));
    this.idAndPostMap.set(post.id, post);
  }

  public delete(id: string):void {
    const result = this.idAndPostMap.delete(id);
    TslLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }
}
