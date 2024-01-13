export interface IPhotoDao {
  /**
   * @returns public URL
   */
  uploadPostPhoto(postId: string, imageBase64: string): Promise<string>;

  /**
   * @returns public URL
   */
  uploadUserIcon(userId: string, imageBase64: string): Promise<string>;
  
  /**
   * 
   * @param photoUrl e.g. "https://storage.googleapis.com/tokyo-sanpo-life-dev.appspot.com/posts/ji3XViNverqk3FiY7Nt1.jpg" or "https://storage.googleapis.com/tokyo-sanpo-life-dev.appspot.com/users/icon/ji3XViNverqk3FiY7Nt1.jpg" 
   */
    deletePhoto(photoUrl: string): Promise<boolean>;
}
