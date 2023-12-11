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

interface SanpoComment {
  userName: string;
  comment: string;
  commentDate: Date;
}

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