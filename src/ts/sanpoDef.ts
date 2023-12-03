interface SanpoComment {
  userName: string;
  comment: string;
  commentDate: Date;
}

interface SanpoContent {
  userName: string;
  title: string;
  imageUrl: string;
  lat: number;
  lon: number;
  description: string;
  insertDate: Date;
  sanpoComment: SanpoComment[]
}