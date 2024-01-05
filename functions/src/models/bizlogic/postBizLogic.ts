import { geohashForLocation } from "geofire-common";
import { IEmojiEvaluationsDao } from "../dao/interface/iEmojiEvaluationsDao";
import { MockEmojiEvaluationsDao } from "../dao/mock/mockEmojiEvaluationsDao";
import { FirestorePostsDao } from "../dao/firestore/firestorePostsDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { PostConvertor, PostDto } from "../dto/postDto";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IUsersDao } from "../dao/interface/iUsersDao";
import { FirestoreUsersDao } from "../dao/firestore/firestoreUsersDao";
import { leftUser } from "../dto/userDto";
import { ICommentsDao } from "../dao/interface/iCommentsDao";
import { MockCommentsDao } from "../dao/mock/mockCommentsDao";
import { PostDoc } from "../dao/doc/postDoc";

export class PostBizLogic {
  //private postsDao: PostDtosDao = new MockPostsDao();
  private postsDao: IPostsDao = new FirestorePostsDao();
  private usersDao: IUsersDao = new FirestoreUsersDao();
  private commentsDao: ICommentsDao = new MockCommentsDao();
  private emojiEvaluationsDao: IEmojiEvaluationsDao = new MockEmojiEvaluationsDao();

  public async listOrderbyInsertedAtDesc(): Promise<PostDto[]> {
    const postDocs = await this.postsDao.listOrderbyInsertedAtDesc(100, 0);
    const postDtos = this.convertDocsToDtos(postDocs);
    return postDtos;
  }

  public async listByUserId(userId: string): Promise<PostDto[]> {
    const postDocs = await this.postsDao.listByUserId(userId);
    const postDtos = this.convertDocsToDtos(postDocs);
    return postDtos;
  }

  public async listByGeoQuery(lat: number, lng: number, distanceKM: number): Promise<PostDto[]> {
    const postDocs = await this.postsDao.listByGeoQuery(lat, lng, distanceKM);
    const postDtos = this.convertDocsToDtos(postDocs);
    return postDtos;
  }

  private async convertDocsToDtos(postDocs: PostDoc[]) {
    const userIds: string[] = [];
    postDocs.map(postDoc => userIds.push(postDoc.postedFirebaseUserId));
    const idAndUserDocMap = await this.usersDao.list(userIds);

    const postDtos: PostDto[] = [];
    postDocs.forEach(async postDoc => {
      let userDoc = idAndUserDocMap.get(postDoc.postedFirebaseUserId);
      if (userDoc == undefined) {
        userDoc = leftUser;
      }

      // omit putting comments and emoji evaluations for list.
      const dto = PostConvertor.convert(postDoc, userDoc, [], []);
      postDtos.push(dto)
    })

    return postDtos;
  }

  public async find(postId: string): Promise<PostDto | null> {
    const postDoc = await this.postsDao.read(postId);
    if(postDoc == null){
      return null;
    }

    let userDoc = await this.usersDao.read(postDoc!.postedFirebaseUserId);
    if (userDoc == undefined) {
      userDoc = leftUser;
    }

    const commentDocs = await this.commentsDao.list(postId);
    const emojiEvalutions = await this.emojiEvaluationsDao.list(postId);
    const postDto = PostConvertor.convert(postDoc, userDoc, commentDocs, emojiEvalutions);
    return postDto;
  }

  public async create(postDto: PostDto): Promise<string> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    const postDoc: PostDoc = {
      postedFirebaseUserId: firebaseUserId,
      imageUrl: postDto.imageUrl,
      lat: postDto.lat,
      lng: postDto.lng,
      geohash: geohashForLocation([postDto.lat, postDto.lng]),
      categoryId: postDto.postCategory.getId(),
      description: postDto.description,
      insertedAt: postDto.insertedAt,
      updatedAt: postDto.updatedAt,
    }
    
    return await this.postsDao.create(postDoc);
  }

  public async delete(reqParamUserId: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    if (reqParamUserId != firebaseUserId) {
      ReqLogUtil.warn('can not delete others account!');
      return false;
    }
    await this.postsDao.delete(reqParamUserId);
    return true;
  }

  /**
   * 
   * @param postId 
   * @param userId null when not logged in.
   * @returns 
   */
  public findEmojiEvaluations(postId: string, userId: string | null): Map<string, [number, boolean]> {
    const emojiEvaluations = this.emojiEvaluationsDao.list(postId);
    const unicode_count_userPut: Map<string, [number, boolean]> = new Map<string, [number, boolean]>();

    for (let emojiEvaluation of emojiEvaluations) {
      let userPut = false;
      if (emojiEvaluation.evaluatingUserId === userId) {
        userPut = true;
      }

      if (unicode_count_userPut.has(emojiEvaluation.unicode)) {
        let count_userPut = unicode_count_userPut.get(emojiEvaluation.unicode)!;
        let currentCount = count_userPut[0];
        let existingUserPut = count_userPut[1];

        // このアルゴリズムの説明。
        // 基本的には、existingの結果を維持する。
        // ただし、これまでfalseで、今回初めてuserPutがtrueが来たら、以降はずっとtrueを維持したい。
        let newUserPut = existingUserPut;
        if (!existingUserPut && userPut) {
          newUserPut = true;
        }
        let newCount_newUserPut: [number, boolean] = [currentCount + 1, newUserPut];
        unicode_count_userPut.set(emojiEvaluation.unicode, newCount_newUserPut);
      } else {
        unicode_count_userPut.set(emojiEvaluation.unicode, [1, userPut]);
      }
    }

    return unicode_count_userPut;
  }

  public putEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void {
    this.emojiEvaluationsDao.create(postId, unicode, evaluatingUserId);
  }

  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void {
    this.emojiEvaluationsDao.delete(postId, unicode, evaluatingUserId);
  }
}
export const postLogic = new PostBizLogic();