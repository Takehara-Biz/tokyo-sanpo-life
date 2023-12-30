// define class, interface, enum here.

class PostCategory {
  private constructor(
    private id: number,
    private emoji: string,
    private label: string
  ){}

  public static readonly Flower = new PostCategory(1, '🌸', '花、植物');
  public static readonly Landscape = new PostCategory(2, '🏞', '自然、公園、風景、山、空、川、海');
  public static readonly Cafe = new PostCategory(3, '☕️', 'カフェ、飲食店');
  public static readonly Shrine = new PostCategory(4, '⛩', '神社、寺、城');
  public static readonly Building = new PostCategory(5, '🏬', 'ビル、家、タワー、人工物、モニュメント');
  public static readonly Other = new PostCategory(6, '💡', 'その他');
  public static readonly Categories = [
    PostCategory.Flower,
    PostCategory.Landscape,
    PostCategory.Cafe,
    PostCategory.Shrine,
    PostCategory.Building,
    PostCategory.Other,
  ]

  public getId(): number {
    return this.id;
  }
  public getEmoji(): string {
    return this.emoji;
  }
  public getLabel(): string {
    return this.label;
  }
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
const CategoryIdAndMarkerTypeDefMap: Map<number, IMarkerTypeDef> = new Map<number, IMarkerTypeDef>();
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Flower.getId(), {iconKeyWord: "filter_vintage", glyphColor: "#ff0000", bgColor: "#ff99cc"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Landscape.getId(), {iconKeyWord: "landscape", glyphColor: "#33cc00", bgColor: "#ccffcc"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Cafe.getId(), {iconKeyWord: "local_cafe", glyphColor: "#663300", bgColor: "#ffcc99"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Shrine.getId(), {iconKeyWord: "temple_buddhist", glyphColor: "#6600ff", bgColor: "#cc99ff"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Building.getId(), {iconKeyWord: "location_city", glyphColor: "#0000ff", bgColor: "#99ffff"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Other.getId(), {iconKeyWord: "lightbulb", glyphColor: "#ff3300", bgColor: "#ffffcc"});

interface IUser {
  id: string,
  userName: string,
  userIconBase64: string,
  selfIntroduction: string;
  twitterProfileLink: string;
  instagramProfileLink: string;
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
  id: string,
  user: IUser,
  imageUrl: string;
  lat: number;
  lng: number;
  postCategory: PostCategory;
  description: string;
  insertDate: Date;
  postComments: IPostComment[];
  emojiEvaluations: IEmojiEvaluation[];
}

/**
 * 絵文字評価
 */
interface IEmojiEvaluation {

  evaludatedPostId: string;
  /**
   * the type of emoji
   */
  unicode: string;

  evaluatingUserId: string;
}