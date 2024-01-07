export interface IPhotoDao {
  /**
   * @returns public URL
   */
  upload(postId: string, imageBase64: string): Promise<string>
  /**
   * 
   * @param photoUrl e.g. "https://storage.googleapis.com/tokyo-sanpo-life-dev.appspot.com/ji3XViNverqk3FiY7Nt1.jpg"
   */
  delete(photoUrl: string): Promise<boolean>
}
