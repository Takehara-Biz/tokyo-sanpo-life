import express from 'express'
import favicon from 'serve-favicon'
const app: express.Express = express()
const port = 3000

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(favicon('./public/images/favicon.ico'));

app.get('/how-to-use', function(req, res, next) {
  res.render('pages/how-to-use', { menu1: true });
});
app.get('/new-posts', function(req, res, next) {

  // define class, interface, enum here.

/**
 * 投稿コンテンツの種類
 */
enum ContentTypeEnum {
  // 花、植物、
  Flower,
  // 自然、公園、風景、空
  Landscape,
  // カフェ、飲食店
  Cafe,
  // 神社、寺、城
  Shrine,
  // 人工物、モニュメント
  Object,
  // ビル、家、タワー
  Building,
  // 海、川、池、湖
  Water,
  // その他
  Other
}

/**
 * マーカーの種類の定義
 */
interface IMarkerTypeDef {
  iconKeyWord: string;
  glyphColor: string;
  bgColor: string;
}

/**
 * マーカーの種類
 */
const MarkerTypeDef: Map<ContentTypeEnum, IMarkerTypeDef> = new Map<ContentTypeEnum, IMarkerTypeDef>();
MarkerTypeDef.set(ContentTypeEnum.Flower, {iconKeyWord: "filter_vintage", glyphColor: "#ff0000", bgColor: "#ff99cc"});
MarkerTypeDef.set(ContentTypeEnum.Landscape, {iconKeyWord: "landscape", glyphColor: "#33cc00", bgColor: "#ccffcc"});
MarkerTypeDef.set(ContentTypeEnum.Cafe, {iconKeyWord: "local_cafe", glyphColor: "#663300", bgColor: "#ffcc99"});
MarkerTypeDef.set(ContentTypeEnum.Shrine, {iconKeyWord: "temple_buddhist", glyphColor: "#6600ff", bgColor: "#cc99ff"});
MarkerTypeDef.set(ContentTypeEnum.Object, {iconKeyWord: "draw_abstract", glyphColor: "#000000", bgColor: "#cccccc"});
MarkerTypeDef.set(ContentTypeEnum.Building, {iconKeyWord: "location_city", glyphColor: "#ffffff", bgColor: "#666666"});
MarkerTypeDef.set(ContentTypeEnum.Water, {iconKeyWord: "water", glyphColor: "#0000cc", bgColor: "#99ccff"});
MarkerTypeDef.set(ContentTypeEnum.Other, {iconKeyWord: "lightbulb", glyphColor: "#ff3300", bgColor: "#ffffcc"});

interface IUser {
  userId: string,
  userName: string,
  iconUrl: string,
  selfIntroduction?: string;
  twitterProfileLink?: string;
  instagramProfileLink?: string;
}

/**
 * 投稿に対するコメント
 */
interface IPostComment {
  user: IUser;
  comment: string;
  commentDate: Date;
}

/**
 * 投稿
 */
interface IPost {
  user: IUser;
  title: string;
  contentTypeEnum: ContentTypeEnum;
  imageUrl: string;
  lat: number;
  lon: number;
  description: string;
  insertDate: Date;
  postComments: IPostComment[]
}

  const DummyData: IPost[] = [
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

  res.render('pages/new-posts', { posts: DummyData });
});
app.get('/map', function(req, res, next) {
  res.render('pages/map', { title: 'Map' });
});
app.get('/column', function(req, res, next) {
  res.render('pages/column', { menu2: true });
});
app.get('/my-page', function(req, res, next) {
  res.render('pages/my-page', { title: 'My Page' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})