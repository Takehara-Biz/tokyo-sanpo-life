import { IPost, IPostComment, PostCategory } from '../serverTslDef';

export class PostsDao {

  private idAndPostMap: Map<string, IPost> = new Map<string, IPost>();

  constructor(postCount: number){
    this.generateRandomPosts(postCount);
  }

  private generateRandomPosts(postCount: number): void{
    const commentsCount = 10;
    const comments: IPostComment[] = this.createRandomComments(commentsCount);
    for (let i = 0; i < postCount; i++) {
      let post = {
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: this.generateRandomString(8),
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        title: this.generateRandomString(22),
        postCategory: this.chooseContentTypeEnumRandomly(),
        imageUrl: "https://media.timeout.com/images/105544832/1372/772/image.webp",
        lat: 35.6 + (Math.random() / 10),
        lon: 139.7 + (Math.random() / 10),
        description: this.generateRandomString(300),
        insertDate: new Date("2023/12/01"),
        postComments: comments,
      };
      this.idAndPostMap.set(i.toString(), post);
    }
  }

  private generateRandomString(charCount: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < charCount; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private createRandomComments(count: number): IPostComment[] {
    const comments: IPostComment[] = [];
    for (let i = 0; i < count; i++) {
      comments.push({
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: this.generateRandomString(5),
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        comment: this.generateRandomString(100),
        commentDate: new Date("2023/12/01"),
      },)
    }
    return comments;
  }

  private chooseContentTypeEnumRandomly(): PostCategory {
    const index = Math.floor(Math.random() * PostCategory.Categories.length);
    return PostCategory.Categories[index];
  }

  public findPosts(): IPost[] {
    return [...this.idAndPostMap.values()];
  }

  public findPost(id: string): IPost | null {
    return this.idAndPostMap.get(id) ?? null;
  }

  public createPost(post: IPost):void {
    this.idAndPostMap.set(post.id, post);
  }
}