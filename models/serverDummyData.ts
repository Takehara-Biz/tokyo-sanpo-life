import { ContentTypeEnum, IPost } from './serverTslDef';

export const ServerDummyData: IPost[] = [
  {
    user: {
      userId: "1",
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
        user: {
          userId: "2",
          userName: "Taro",
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        comment: "この前行きました！素晴らしかったです。",
        commentDate: new Date("2023/12/01"),
      },
      {
        user: {
          userId: "3",
          userName: "Hanako",
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        comment: "いつか、行ってみたいです〜",
        commentDate: new Date("2023/12/02"),
      }
    ]
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "新宿御苑",
    contentTypeEnum: ContentTypeEnum.Landscape,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.6851763,
    lon: 139.7074714,
    description: "紅葉が見頃です〜",
    insertDate: new Date("2023/12/01"),
    postComments: [
      {
        user: {
          userId: "4",
          userName: "Bob",
          iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
        },
        comment: "It's so nice!",
        commentDate: new Date("2023/12/01"),
      }
    ]
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "カフェ01",
    contentTypeEnum: ContentTypeEnum.Cafe,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.6951763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "神社01",
    contentTypeEnum: ContentTypeEnum.Shrine,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.7051763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "オブジェクト01",
    contentTypeEnum: ContentTypeEnum.Object,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.7151763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "ビル01",
    contentTypeEnum: ContentTypeEnum.Building,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.7251763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "川01",
    contentTypeEnum: ContentTypeEnum.Water,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.7351763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  },
  {
    user: {
      userId: "1",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
    },
    title: "その他01",
    contentTypeEnum: ContentTypeEnum.Other,
    imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
    lat: 35.7451763,
    lon: 139.7074714,
    description: "適当",
    insertDate: new Date("2023/12/01"),
    postComments: []
  }
];