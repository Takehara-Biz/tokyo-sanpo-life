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

/**
 * 投稿に対するコメント
 */
interface SanpoComment {
  userName: string;
  comment: string;
  commentDate: Date;
}

/**
 * 投稿
 */
interface SanpoContent {
  userName: string;
  title: string;
  contentTypeEnum: ContentTypeEnum;
  imageUrl: string;
  lat: number;
  lon: number;
  description: string;
  insertDate: Date;
  sanpoComment: SanpoComment[]
}