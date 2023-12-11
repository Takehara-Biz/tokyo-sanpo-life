const DummyData: SanpoContent[] = [
    {
      userName: "Yasu",
      title: "東京駅",
      contentTypeEnum: ContentTypeEnum.Building,
      imageUrl: "https://media.timeout.com/images/105544832/1372/772/image.webp",
      lat: 35.6812405,
      lon: 139.7645499,
      description: "ここが東京駅です〜",
      insertDate: new Date("2023/12/01"),
      sanpoComment: [
        {
          userName: "Taro",
          comment: "この前行きました！素晴らしかったです。",
          commentDate: new Date("2023/12/01"),
        },
        {
          userName: "Hanako",
          comment: "いつか、行ってみたいです〜",
          commentDate: new Date("2023/12/02"),
        }
      ]
    },
    {
      userName: "Yasu",
      title: "新宿御苑",
      contentTypeEnum: ContentTypeEnum.Landscape,
      imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
      lat: 35.6851763,
      lon: 139.7074714,
      description: "紅葉が見頃です〜",
      insertDate: new Date("2023/12/01"),
      sanpoComment: [
        {
          userName: "Bob",
          comment: "It's so nice!",
          commentDate: new Date("2023/12/01"),
        }
      ]
    },
    {
      userName: "Yasu",
      title: "カフェ01",
      contentTypeEnum: ContentTypeEnum.Cafe,
      imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
      lat: 35.6951763,
      lon: 139.7074714,
      description: "適当",
      insertDate: new Date("2023/12/01"),
      sanpoComment: []
    },
    {
      userName: "Yasu",
      title: "神社01",
      contentTypeEnum: ContentTypeEnum.Shrine,
      imageUrl: "https://s3-ap-northeast-1.amazonaws.com/thegate/2021/04/14/11/31/14/shinjukugyoen.jpg",
      lat: 35.7051763,
      lon: 139.7074714,
      description: "適当",
      insertDate: new Date("2023/12/01"),
      sanpoComment: []
    }
  ];