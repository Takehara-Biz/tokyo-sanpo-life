import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { firebaseConfig } from "../../auth/publicEnvVarsModule";
import { IPhotoDao } from "../interface/iPhotoDao";
import { Storage } from "@google-cloud/storage";

export class StoragePhotoDao implements IPhotoDao {
  async upload(postId: string, imageBase64: string): Promise<string> {
    ReqLogUtil.info("[BEGIN] upload Photo : post id => " + postId);
    const storage = new Storage();

    const bucket = storage.bucket(firebaseConfig.storageBucket);
    const file = bucket.file(postId + ".jpg");

    // If having「data:image/jpeg;base64,」, you cannot open and see the image file...
    const buffer = Buffer.from(imageBase64.replace("data:image/jpeg;base64,", ""), 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
      resumable: false,
      public: true,
      validation: 'md5'
    });

    const publicUrl = file.publicUrl();
    ReqLogUtil.info("[  END] upload Photo : public url => " + publicUrl);
    return publicUrl;
  }

  async delete(photoUrl: string): Promise<boolean> {
    ReqLogUtil.info("[BEGIN] delete Photo : photoUrl => " + photoUrl);

    const storage = new Storage();
    const bucket = storage.bucket(firebaseConfig.storageBucket);
    
    const file = bucket.file(this.identifyDeleteFileName(photoUrl));

    const result = await file.delete().then(() => {
      ReqLogUtil.info("successfully delete the Photo => " + photoUrl);
      return true;
    }).catch((err) => {
      ReqLogUtil.error('failed deleting the photo => ' + photoUrl);
      ReqLogUtil.error('ERROR: ' + err);
      return false;
    });

    ReqLogUtil.info("[BEGIN] delete Photo : result => " + result);
    return result;
  }

  /**
   * 
   * @param photoUrl e.g. "https://storage.googleapis.com/tokyo-sanpo-life-dev.appspot.com/ji3XViNverqk3FiY7Nt1.jpg"
   * @returns e.g. "ji3XViNverqk3FiY7Nt1.jpg"
   * if the upload files were saved under sub directory, this method won't work correctly...!
   */
  private identifyDeleteFileName(photoUrl: string): string{
    const words = photoUrl.split('/');
    return words[words.length - 1];
  }
}