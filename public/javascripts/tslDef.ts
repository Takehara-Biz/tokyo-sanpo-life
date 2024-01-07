// define class, interface, enum here.

/**
 * カテゴリーの種類を定義したクラス
 */
class PostCategory {
  private constructor(
    private id: number,
    private emoji: string,
    private label: string
  ) {}

  public static readonly Landscape = new PostCategory(1, "🏞", "風景、公園など");
  public static readonly Flower = new PostCategory(2, "🌸", "花、植物など");
  public static readonly Cafe = new PostCategory(3, "☕️", "カフェ、飲食店など");
  public static readonly Shrine = new PostCategory(4, "⛩", "神社、寺、城など");
  public static readonly Building = new PostCategory(5, "🏬", "ビル、民家など");
  public static readonly Other = new PostCategory(6, "💡", "その他");
  public static readonly Categories = [
    PostCategory.Landscape,
    PostCategory.Flower,
    PostCategory.Cafe,
    PostCategory.Shrine,
    PostCategory.Building,
    PostCategory.Other,
  ];
  public static findCategory(id: number): PostCategory {
    return PostCategory.Categories[id - 1];
  }

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
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Landscape.getId(), {iconKeyWord: "landscape", glyphColor: "#33cc00", bgColor: "#ccffcc"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Flower.getId(), {iconKeyWord: "filter_vintage", glyphColor: "#ff0000", bgColor: "#ff99cc"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Cafe.getId(), {iconKeyWord: "local_cafe", glyphColor: "#663300", bgColor: "#ffcc99"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Shrine.getId(), {iconKeyWord: "temple_buddhist", glyphColor: "#6600ff", bgColor: "#cc99ff"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Building.getId(), {iconKeyWord: "location_city", glyphColor: "#0000ff", bgColor: "#99ffff"});
CategoryIdAndMarkerTypeDefMap.set(PostCategory.Other.getId(), {iconKeyWord: "lightbulb", glyphColor: "#ff3300", bgColor: "#ffffcc"});

type UserDto = {
  /** never changed. desginated by firebase authentication */
  firebaseUserId: string;
  loggedIn: boolean;
  userName: string;
  userIconBase64: string;
  selfIntroduction: string;
  xProfileLink: string;
  instagramProfileLink: string;
  insertedAt: Date;
  updatedAt: Date;
}

/**
 * 投稿に対するコメント
 */
type CommentDto = {
  firestoreDocId: string;
  postFirestoreDocId: string;
  userFirestoreDocId: string;
  /**
   * コメント一覧表示時に、ユーザ名とユーザアイコンの表示が必要。
   */
  commentUserDto?: CommentUserDto;
  comment: string;
  insertedAt: Date;
  updatedAt: Date;
}

type CommentUserDto = {
  firebaseUserId: string,
  userName: string;
  userIconBase64: string;
}

/**
 * 投稿
 */
type PostDto = {
  firestoreDocId: string;
  user: UserDto;
  postedFirebaseUserId: string;
  photoUrl: string;
  lat: number;
  lng: number;
  postCategory: PostCategory;
  description: string;
  postComments: CommentDto[];
  emojiEvals: EmojiEvalDto[];
  insertedAt: Date;
  updatedAt: Date;
}

/**
 * 絵文字評価
 */
type EmojiEvalDto = {
  firestoreDocId: string;
  userFirestoreDocId: string;
  /**
   * the type of emoji
   */
  unicode: string;
  insertedAt: Date;
  updatedAt: Date;
}