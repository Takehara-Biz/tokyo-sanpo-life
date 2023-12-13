import { IPost, IPostComment, ContentTypeEnum } from '../serverTslDef';

export class PostsDao {
  private generateRandomString (charCount: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < charCount; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private createRandomComments(count: number): IPostComment[]{
    const comments: IPostComment[] = [];
    for(let i = 0; i < count; i++) {
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

  public findPosts(): IPost[] {
    const postCount = 50;
    const commentsCount = 10;

    const comments: IPostComment[] = this.createRandomComments(commentsCount);

    const posts: IPost[] = [];
    for(let i = 0; i < postCount; i++) {
      posts.push({
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: this.generateRandomString(8),
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        title: this.generateRandomString(22),
        contentTypeEnum: ContentTypeEnum.Flower,
        imageUrl: "https://media.timeout.com/images/105544832/1372/772/image.webp",
        lat: 35.6812405,
        lon: 139.7645499,
        description: this.generateRandomString(300),
        insertDate: new Date("2023/12/01"),
        postComments: comments,
      });
    }

    return posts;
  }

  public findPost(id: string): IPost {
    const commentsCount = 10;

    return {
      id: "1",
      user: {
        id: "1",
        userName: this.generateRandomString(8),
        iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      },
      title: this.generateRandomString(22),
      contentTypeEnum: ContentTypeEnum.Flower,
      imageUrl: "https://media.timeout.com/images/105544832/1372/772/image.webp",
      lat: 35.6812405,
      lon: 139.7645499,
      description: this.generateRandomString(300),
      insertDate: new Date("2023/12/01"),
      postComments: this.createRandomComments(commentsCount),
    };
  }
}