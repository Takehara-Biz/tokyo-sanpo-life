// define class, interface, enum here.

/**
 * 投稿のカテゴリー
 */
type CategoryType =
  // 花、植物、
  'Flower' |
  // 自然、公園、風景、空
  'Landscape' |
  // カフェ、飲食店
  'Cafe' |
  // 神社、寺、城
  'Shrine' |
  // 人工物、モニュメント
  'Object' |
  // ビル、家、タワー
  'Building' |
  // 海、川、池、湖
  'Water' |
  // その他
  'Other';

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
const MarkerTypeDef: Map<CategoryType, IMarkerTypeDef> = new Map<CategoryType, IMarkerTypeDef>();
MarkerTypeDef.set('Flower', { iconKeyWord: "filter_vintage", glyphColor: "#ff0000", bgColor: "#ff99cc" });
MarkerTypeDef.set('Landscape', { iconKeyWord: "landscape", glyphColor: "#33cc00", bgColor: "#ccffcc" });
MarkerTypeDef.set('Cafe', { iconKeyWord: "local_cafe", glyphColor: "#663300", bgColor: "#ffcc99" });
MarkerTypeDef.set('Shrine', { iconKeyWord: "temple_buddhist", glyphColor: "#6600ff", bgColor: "#cc99ff" });
MarkerTypeDef.set('Object', { iconKeyWord: "draw_abstract", glyphColor: "#000000", bgColor: "#cccccc" });
MarkerTypeDef.set('Building', { iconKeyWord: "location_city", glyphColor: "#ffffff", bgColor: "#666666" });
MarkerTypeDef.set('Water', { iconKeyWord: "water", glyphColor: "#0000cc", bgColor: "#99ccff" });
MarkerTypeDef.set('Other', { iconKeyWord: "lightbulb", glyphColor: "#ff3300", bgColor: "#ffffcc" });

interface IUser {
  id: string,
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
  id: string;
  user: IUser;
  comment: string;
  commentDate: Date;
}

/**
 * 投稿
 */
interface IPost {
  id: string;
  user: IUser;
  title: string;
  categoryType: CategoryType;
  imageUrl: string;
  lat: number;
  lon: number;
  description: string;
  insertDate: Date;
  postComments: IPostComment[]
}