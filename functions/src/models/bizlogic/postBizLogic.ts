import { geohashForLocation } from "geofire-common";
import { IEmojiEvalsDao } from "../dao/interface/iEmojiEvalsDao";
import { PostsColDao } from "../dao/firestore/postsColDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { PostDto } from "../dto/postDto";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IUsersDao } from "../dao/interface/iUsersDao";
import { UsersColDao } from "../dao/firestore/usersColDao";
import { leftUser } from "../dto/userDto";
import { ICommentsDao } from "../dao/interface/iCommentsDao";
import { PostDoc } from "../dao/doc/postDoc";
import { Timestamp } from "firebase-admin/firestore";
import { CommentsColDao } from "../dao/firestore/commentsColDao";
import { EmojiEvalsSubColDao } from "../dao/firestore/post/emojiEvalsSubColDao";
import { DocDtoConvertor } from "../dto/docDtoConvertor";

export class PostBizLogic {
  private postsDao: IPostsDao = new PostsColDao();
  private usersDao: IUsersDao = new UsersColDao();
  private commentsDao: ICommentsDao = new CommentsColDao();
  private emojiEvalsDao: IEmojiEvalsDao = new EmojiEvalsSubColDao();

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
      const dto = DocDtoConvertor.toPostDto(postDoc, userDoc, [], []);
      postDtos.push(dto)
    })

    return postDtos;
  }

  public async find(postId: string): Promise<PostDto | null> {
    const postDoc = await this.postsDao.read(postId);
    if(postDoc == null){
      ReqLogUtil.warn('there is no such post. post id : ' + postId);
      return null;
    }

    let userDoc = await this.usersDao.read(postDoc!.postedFirebaseUserId);
    if (userDoc == undefined) {
      ReqLogUtil.info(`there is no user (id:${postDoc!.postedFirebaseUserId}) who wrote the post. perhaps, already left(quit)`);

      userDoc = leftUser;
    }

    const commentDocs = await this.commentsDao.listOrderbyInsertedAtAsc(postId);
    const emojiEvalutions = await this.emojiEvalsDao.list(postId);
    const postDto = DocDtoConvertor.toPostDto(postDoc, userDoc, commentDocs, emojiEvalutions);
    return postDto;
  }

  public async create(postDto: PostDto): Promise<string> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    const postDoc: PostDoc = {
      postedFirebaseUserId: firebaseUserId,
      photoBase64: postDto.photoBase64,
      lat: postDto.lat,
      lng: postDto.lng,
      geohash: geohashForLocation([postDto.lat, postDto.lng]),
      categoryId: postDto.postCategory.getId(),
      description: postDto.description,
      insertedAt: Timestamp.fromDate(postDto.insertedAt),
      updatedAt: Timestamp.fromDate(postDto.updatedAt),
    }
    
    return await this.postsDao.create(postDoc);
  }

  public async update(postDto: PostDto): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    if(firebaseUserId != postDto.postedFirebaseUserId){
      ReqLogUtil.warn('can not update others post!');
      ReqLogUtil.warn('identified firebaseUserId : ' + firebaseUserId);
      ReqLogUtil.warn('postedFirebaseUserId in firestore : ' + postDto.postedFirebaseUserId);
      return false;
    }

    const newPostDoc: PostDoc = {
      // only some properties will be update!
      firestoreDocId: postDto.firestoreDocId!, //never updated!
      postedFirebaseUserId: postDto.postedFirebaseUserId, //never updated!
      photoBase64: postDto.photoBase64, //never updated!
      lat: postDto.lat,
      lng: postDto.lng,
      geohash: geohashForLocation([postDto.lat, postDto.lng]),
      categoryId: postDto.postCategory.getId(),
      description: postDto.description,
      insertedAt: Timestamp.fromDate(postDto.insertedAt), // never changed!
      updatedAt: Timestamp.now(),
    }
    
    await this.postsDao.update(newPostDoc);
    return true;
  }

  public async delete(reqParamPostId: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    const postDoc = await this.postsDao.read(reqParamPostId);
    if(postDoc == null){
      ReqLogUtil.warn('there is no such post. post id : ' + reqParamPostId);
      return false;
    }

    if (postDoc.postedFirebaseUserId != firebaseUserId) {
      ReqLogUtil.warn('can not delete the post created by another user!');
      return false;
    }
    await this.postsDao.delete(reqParamPostId);
    return true;
  }
}
export const postLogic = new PostBizLogic();