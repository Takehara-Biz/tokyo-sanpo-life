import { ServerDummyData } from './serverDummyData'
import { IPost, ContentTypeEnum } from './serverTslDef';

export class BizLogic {
  public findPosts(): IPost[] {
    return ServerDummyData;
  }

  public findPost(id: string): IPost {
    const Dummy = {
      id: "1",
      user: {
        id: "1",
        userName: "Yasu",
        iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      },
      title: "東京駅",
      contentTypeEnum: ContentTypeEnum.Flower,
      imageUrl: "https://media.timeout.com/images/105544832/1372/772/image.webp",
      lat: 35.6812405,
      lon: 139.7645499,
      description: "ここが東京駅です〜",
      insertDate: new Date("2023/12/01"),
      postComments: [
        {
          id: "1",
          user: {
            id: "2",
            userName: "Taro",
            iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
          },
          comment: "この前行きました！素晴らしかったです。",
          commentDate: new Date("2023/12/01"),
        },
        {
          id: "3",
          user: {
            id: "3",
            userName: "Hanako",
            iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
          },
          comment: "いつか、行ってみたいです〜",
          commentDate: new Date("2023/12/02"),
        }
      ]
    };
    return Dummy;
  }
}