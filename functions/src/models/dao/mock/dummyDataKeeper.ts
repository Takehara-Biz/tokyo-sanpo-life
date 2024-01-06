import { geohashForLocation } from "geofire-common";
import { CommentDto } from "../../dto/commentDto";
import { UserDto } from "../../dto/userDto";
import { PostCategory } from "../../postCategory";
import { PostDoc } from "../doc/postDoc";
import { EmojiEvalDoc } from "../doc/post/emojiEvalsDoc";
import { BasicUserIconUtil } from "../basicUserIconBase64";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Firestoreの代わりにダミーとしてデータを保持するクラス
 */
class DummyDataKeeper {
  public readonly postCount = 3;
  public readonly userCount = 3;
  public idAndPostMap: Map<string, PostDoc> = new Map<string, PostDoc>();
  public idSequence: number = 0;
  public idAndUserMap: Map<string, UserDto> = new Map<string, UserDto>();
  
  constructor() {
    this.generateRandomPosts(this.postCount);
    this.idSequence = this.postCount - 1;
    this.generateRandomUsers(this.userCount);
  }

  public nextval(): number {
    return ++this.idSequence;
  }

  private generateRandomUsers(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const now = new Date();
      const user = {
        firebaseUserId: i.toString(),
        loggedIn: true,
        userName: DummyDataKeeper.generateRandomString(3, 12),
        userIconBase64: BasicUserIconUtil.defaultUserIconBase64,
        selfIntroduction: "こんにちは〜。" + DummyDataKeeper.generateRandomString(1, 50),
        xProfileLink: "https://www.yahoo.co.jp",
        instagramProfileLink: "https://www.yahoo.co.jp",
        insertedAt: now,
        updatedAt: now,
      };
      this.idAndUserMap.set(i.toString(), user);
    }
  }

  private generateRandomPosts(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const now = Timestamp.now();
      const lat = 35.2 + Math.random();
      const lng = 139.3 + Math.random();

      const post : PostDoc = {
        firestoreDocId: i.toString(),
        postedFirebaseUserId: i.toString(),
        photoBase64: DummyDataKeeper.dummyPhotoBase64,
        lat: lat,
        lng: lng,
        /**
         * for easy search.
         * https://firebase.google.com/docs/firestore/solutions/geoqueries?hl=ja#solution_geohashes
         */
        geohash: geohashForLocation([lat, lng]),
        categoryId: this.chooseContentTypeEnumRandomly().getId(),
        description: DummyDataKeeper.generateRandomString(1, 100),
        insertedAt: now,
        updatedAt: now,
      };
      this.idAndPostMap.set(i.toString(), post);
    }
  }

  public createRandomComments(count: number): CommentDto[] {
    const comments: CommentDto[] = [];
    for (let i = 0; i < count; i++) {
      const now = new Date();
      comments.push({
        firestoreDocId: i.toString(),
        postFirestoreDocId: i.toString(),
        userFirestoreDocId: i.toString(),
        userDto: {
          firebaseUserId: i.toString(),
          loggedIn: true,
          userName: DummyDataKeeper.generateRandomString(3, 12),
          userIconBase64: BasicUserIconUtil.defaultUserIconBase64,
          selfIntroduction: "",
          xProfileLink: "",
          instagramProfileLink: "",
          insertedAt: now,
          updatedAt: now,
        },
        comment: DummyDataKeeper.generateRandomString(1, 100),
        insertedAt: now,
        udpatedAt: now
      },);
    }
    return comments;
  }

  public createRandomEmojiEvals(minTypeCount: number, maxTypeCount: number, minTotalCount: number, maxTotalCount: number, postId: string): EmojiEvalDoc[] {
    const evaluations: EmojiEvalDoc[] = [];
    const typeCount = DummyDataKeeper.generateRandomNumber(minTypeCount, maxTypeCount);
    if(minTotalCount < 1){
      minTotalCount  = 1;
    }
    
    const uniqueEmojis = this.generateUniqueRandomEmojis(typeCount);
    
    for (let i = 0; i < uniqueEmojis.length; i++) {
      const totalCount = DummyDataKeeper.generateRandomNumber(minTotalCount, maxTotalCount);
      for(let j = 0; j < totalCount; j++){
        const now = new Date();
        evaluations.push({
          unicode: uniqueEmojis[i],
          userFirestoreDocId: j.toString(),
          insertedAt: now,
          updatedAt: now
        },);
      }
    }
    return evaluations;
  }

  private generateUniqueRandomEmojis(count: number): string[] {
    const start = 0x1f600;
    const end = 0x1f64f;
    const range = end - start;
    
    const unicodes: string[] = [];
    while(unicodes.length < count){
      const code = Math.floor(Math.random() * range) + start;
      const unicode = String.fromCodePoint(code);
      if(unicodes.includes(unicode)){
        continue;
      } else {
        unicodes.push(unicode);
      }
    }
    return unicodes;
  }

  private chooseContentTypeEnumRandomly(): PostCategory {
    const index = Math.floor(Math.random() * PostCategory.Categories.length);
    return PostCategory.Categories[index];
  }

  public static generateRandomString(charMinCount: number, charMaxCount: number): string {
    const useChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = Math.floor(Math.random() * (charMaxCount - charMinCount)) + charMinCount;
    let result = "";
    for (let i = 0; i < strLength; i++) {
      result += useChar.charAt(Math.floor(Math.random() * useChar.length));
    }
    return result;
  }

  private static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private static dummyPhotoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAEsAZADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgMAAQQFBgf/xAA8EAACAgEDAgQEBAUEAgIBBQABAgMRAAQSITFBBRNRYSJxgZEUMqHwBkKxwdEVI+HxM1IkYpJDcoKy0v/EABoBAQEBAQEBAQAAAAAAAAAAAAABAgMEBQb/xAAkEQEBAAICAgICAwEBAAAAAAAAAQIRAxIhMUFRBBMiYYFxMv/aAAwDAQACEQMRAD8A6bAHFsuQsRgl8+pI+LbAkYtgMbd4DDNMUoqMEoMYRgPlYpTLXbAIw2wDm3G1WSsNUJ5ynyLJ42DKyyMuuLwArJWXWTAHKwslYUOTLyYFVlYWSuMAay6y6ywMAayVhZWBKyVky8CAYS2CKygcIYWNCEOuHsLjgfEP1zPG1GxmqJ6IZTRBsZizT0Y2X26uk8J2RwalpJA4ItFFHr0/z9c06PzTrZzMvK7hHRHQ98y6rxcmECNCCVo9qN84keJ7AArMwb81jke3vnz88ebK7sfV48uDCamTsSJHK22jaimYiqI9/r+mcfUPDG/kBAqrbJvHez3+hONl8URj8NvuHxWKr2GZZZI545LFSSEktXQ5wvFyfT148/FPHZb6SF1aSJ/L3Xbn068+w4wY9RqUgbyNkbAi1kP8tcnjG6aBYtMjyAbRwK5PP/WDqNK8sHmswQSWxAFMxquMzcMsfLU5McvG2nQ6yUsN7CXctHaaPyF5ln+EyPDpXmUNvkVTTUODXrz98bBoGmgjjvymX4gdu7a1evyvGSaQhbXUH8vFsF3WehrGOr/6M7Z5xL0c0GsSGASIUnUuo6Gz15+/2xniDbViXTSE9VNcCwenvXOcv8O3hWqfXQrHNC1iSKIfkHcqO9VznQVy2nh1MPKzVtPXr6j0zLUt9kDSxvIrsllVoms0Jp31OpWN2aJTwq9KH+cy6fVNMvmC0IW6rvdXnUjSSeWMnh2NhgaPrnbLrfXpww7ybyvmiOl00E3mMLRRSo3dvX5YA1g1PmGOVSVpTXUXWH4xI5BhjAVgD8VX2zDpo4dMrMygNIQX2+nT+mYyyt8OmGEnmfK0jbTyCHTyyMWBdgWL9+aJwoImfWSbWlYBiCT0U16/XOrHHCJAYwAjD8/t88L/AGlUsoAQ8/ALscf4zGm+zGI3LbIAoZ1IY+uadD4emkFvRc2bF9TycHQo4naZivl8qD9bx+sDSskSGixu76AZZ62zld3UDqCjRBEq2Ip+w5GAi+ZqUCsdwBJBNhT0Iy307lTtevLFXV9uflleHKsJcsrIGUMN4o9TfH2++TXlPUcIjAZcaUYdsGjn2n52wnbWVzj9owdoy7TqWBfbFuvPI5zQFPphCO+uTZ12xGO+2MTSlrsVmpYax5YBT61kuf01jwz3XPkQRjavXEbDfrmx1tgTgvsUds1KzljKyiOzlSCumMZhdg4lySc1HO6kB9MojGKm4HnkZGjIAPUHK56pWTC2EjpkCk9sAMJUZjQF41YCVsmssvsAWP75N/Tcx+aAQ0LOCx7DC2Ox6YQgarbjBq31CMu+KxvlCuuAQBl2zZYDJl1krCKyZeTArLyZeUWMbG204KqTjlizNdMJThTpziihBo5v02glLRh1KK/RiOBm0eEklR5imz0Hz5zheXHG+a9mPDnnN6cdI2YgAEk9s6ej8M82MPMWXcfhA/mGdDTeH6eLUBw7MUPAPS8mvnGmJmAoL056+v79883L+R8YvZwfief5sXiCmMxoAtCwqnqwoemNh00kmlA1aAlPyg8cfqcx6rxOLemo5JVxYJ71jz4mZoWkUFPh/L3zyzLeOnvvHrKZQCwsJtiy7Ym5AAbp/wDlmDXhxKI9P5QkcL/uO5Bqz16/55zW/iYSiXDpdfI+mNMK6kojoRxe8j1sGsy3pk00UlMWhYqu74fPaq59T06Zs8PVU0m10EUQPwIpsDufqcTPp/IZmLGtu4LuJXK007yI38qxkstm/hAAJzV1Jr5Y/lct/DGdVEN76d1IUgqOaIA/XOhp9e+9ZQiK72oQ0L7X8s42plgj1Gng07NEsyV5jJ8PPNWehzb4egeEOi3HdK9m2v8Ap3rMzem7cbZt0SVdmtySw5NVub9/oMRJC7whigsMOLAvni8FpXgaXYajI22eSGq+nTpZzoQ6UzQJbmiLA6fX+uT+jxPLSrqZHQgDYg4HA+mY/wAXHawxJ5SjqOg+2G0YGpVNNy5HU80O9/vnD1GlT8Ur+XbsKoCh1wnjY4AE0US07IBQZuvfmszvLJ5o4LKGCgA9B+/6Zp1UgiREJAIFADkk1mJYIw/AdQx/MVPX19v+MlIvT62V1ZjA5CMQTuHPPzwPENXOysySKpip1rofUEnt1+XXnGz6dI4kghZkI5PYsflmQtTBIFVyzU5J4Ht7m+w/TKaM2X0wWjHcY8pXQZL4phn1NvidWRovTA8o3mlkAPXK6ZrbHWEqldcIjjphkAjK3V0wutBHXKYKOcjc81i2BI5wmy5G3MQOMzOhvnNRiPUZWyxTDNy6cssbfbC0eNEQkUDow/XGmPbxlqPvmrkxMJPZQjWq6Nk20Np6Y6SPcL7jKVQwAbrk231AqfDVdcNYQBZHGMUbRhr8XBOZtbmMZ/LL8dsYukHU9PnjbSMc84D6qxQHGTdvpdYz2vbHEDwCcxzTE9aySzHmszMxbrm8cftw5OX4iF8Em8lZVZ0cN7Vkwvnk2mryoHLyVhqhY9MAM6PhXh51sh3EpEv5n9MyrCSemekP+z4dHHpyotAA5Ui7IHboeTnm/I5v14+Hu/D/AB/25/y9RyRoHGriisFJCKZT/L6/bOlDoNGYF2Sb2azu3c8en65xtdq5010bo3EbVtXlmHJ+lZ0IddCkUzQMzuxDncTyRz9M8OX5GWUmvb62H4eHHbb6dnUPGsis0pAK1QY9PkPmM5kusfd51kIKLFea5H6ZiE4l1CPNYX+Zeo63yPXOv4Q8f4Z1tdqngV7X0++csuPOebHbHl4r4xu6QutEkMzB9rgcFehBr9c5I1Gsk1CmRG2Ufg55on6WAB7f272vEbRhVMar0ANAfvrnKPwEEojsBttTXXvmOmV+HacmE91kk0/4h+SUTrGijkWOle/HJ+2VFFq/LeLyAVVFG1lvcQehr65otgSdx5zv6TTx6TSlq+Mi2PfOuXD0x3l7cMfyZnn1wm48vqfDZPxaiYod/wDueV0IPU/qfnnpEEe+w4AjiCeX3BHIznzT+YX2qzMW+FvTIseqASRA/wAYIG3qR3xjw5WefCZ/kYS6nn/hGu1DTTiNTtUAD4j0+g98yNp5irLDMG5AZVNACrzqLp5dhd4SQeOR0I9Ri10ssYRkHmHdZ4riuPpnPLG43TthnMsdxmTToyI0sfmOWAQ1e0ni7+WLfU6jTzGEywmAfEioOR2NnuP850NTqhHFHSmiORQ+A+v+MwavTL50cot4CTZAAUk8V8uf0ybVracyRf7u1Yq5UnknuR++2PPi0cgSGCPcz2SAbIAoWfb39s5Gr0+pkMX4f4mVQ7BVK2e1D5DB03laSWKGZ/Leb4UHJ7Xz9T39cLp6nSBYtPG21AT/ADDj/rLn1gBABFt36cdOM5HiC6jUaGP8Gyh43ALKeD29c2w6GaVYxqWQMQN20dSP6Y38Manur1Usfw0lhje/rXzw21gC/hzUjBTe3gD5ntjng04XY3xEUWo10znanVpEoKlRGTtDAfpj0Tycifim3SHgizt6D/Pf29sZFp2bUhy1BBSqFFEEdf3/AHzBpZZJpil1dcDkUOxr64uTXPwLaNzdCSr454HyxtrVrpMexGAfY3hEMeowGGfRj41Ay32xbIcb8Q6HK3HuM2xonawyFT1rHWpwT98bTRVG8vaDkN5W73yiwlduMBkrgjGeZglseTwSye2CUC45jeLod+csrNgCy9K+oxbA9vvmjYPSxk21yMu0uO2dQ3e8aBwKPOEVByBQp68Y2SaJaJt3rhLCSOl5oXb0JyEAdMnZekYn0xDXQwBpgegzoUG68HKCgNWXvWbxYua2n29RgNDzxnTdAe+L8tQeec1M2LwxzhEb5zSkHHtjtqhspnYD4QBluVqTjmIBplXlqwaVLIyizk2TkNt1FHHlNz4ieZfTj3xn4hwgTcdoNgXxeK8s5YjOSyXxVxyyl3FE2boX61zlhScMIMYKAySSeo1bllrtfSo4b/NwMYW8s1GxHFcHBLEiu2QLj/rU8ekBN2ecNULflGRQB1zU8MsUSyBKRhYN5m2RvHG1m2lGDXRBsY2fVzagnc1D0HTNGn0TTx+YXAXn55Pw6NMwi/KBdsc5ZZYW6vw7Y4ckx3j6p/hO0QMWP5W49vfHNqYwX3cGqNECvlmGG44HEisrBa2j5cYWmgGqlJlbaoCj4ercev3zy8llz8vdxY3Hj8Ty6CHcxkZvgH5SD1xSzacTsp1IJW2osL+X98CIaaCkUcVuBJsg9P8AGSWO1DByjKdzFW60ehzldfDtN32zz6nTSzyQh4wKD2BwOepzJLNpokd5XklABcgAkDjsK9cJtIJXkaIM0w+Ldx9R8vb++Lk0WuZQ6zQpGzUUkU3t9Lv+2ZdB6YsI2MXmAOSWd2oj5VzxiZ9Fp9amzUpI8YKsAzsaJ9OeM0RrPKjIrBGRjfVlax68d/tipYtTDowmm06vKxBKsT0Bvk+l3gMXfozHA++UNHt37eh6C6zdoJWl8+MlTHDtQ0bO7qf6jOJKnissDh9Rp9Nx8bRqWb7nocxrpvEvC9yaLVSOshJdXFMTQuj9P+cI9RqWdmSIIAGNFuvtVYf4SJYTGYd+02Lzj+DePw6ydYJ1ZZxe0dQOOa+mdg6seYFj7kkrdkgVz7YPJE6rHpyibowyk1GKI+X0vOX4FDGjSaqfc7VtiZjyVJuyT68fSs0eJN4hqfEVj0BRI9rb5CLAPt75NUBE7QglpBTlRyOw9OwAyNSbdcqPTFsozQR7YJAz2yvl2MxTBKZoIGCVzcyYuLMyDAK+maipwdo75rszcWbkdQDlEKfbNBQYJT2y9merOYwe+CYzmkx+mCVI65dp1Z9hHvlfTNFA5TIMuzqzk10wCWzQYxgGMDLtmykW2SyeuN2ZRjOXaaoLN5e84XlH1yvLI65Nw1Vh8m4ZPLJ6dMhQDrhfKEK3fK2gdOclDJsPbCBMfpgtESMZRHXC69Ly7TrKy+XzzlmMDHMBfvg7by7Z6wK+h++WY76YQXDC1k2vUjYR2y9pzSAD2yGP0x2OjOFwtuaYNO00gVaHucb+EcFtw/Ld1zmbySe66Y8WV8yMsSqJFLi1BF/LOnrJFMe5AAg+KwOP3ycYyRxQbIkDdDZ5s4U6iZ0DGgzAsBZ/fTPHyck5LHv4eLLilrnxlm0UnwExodwK+uFGjfhSfzCzwDzePlS2KxMIUY0wHAHa6+eW8gWKkRaZfiCiicznljd37dOPDLGyfEAgZmSMguWUgKfQ83jApjl20FAPAXuf3eK08hjdmonedoHcc+vsMesyBjNLwynavOct7d9a2RqoHj8yRCAGPReD17/bJAVdyzncp4KkWL7ZepZnJBNqBftfPX7Zlh8/URoBtDEFmA4HHTI1PTa+pj0gZ2URhgKI4J/fTM8sr6mZTHwtXz2vNeuKIqh4wVrk+gGcnQa6OORmI3qW4/8Ab5kZKuPrZzLMJkQFiFHG1uo9x65onWUuVChWkW949QLF+v8AzgS+K6aWFoyDbEAACySfl/TErrImZfM4jQH3o+h96wQXlbroCuhLHkV7/TM0ikSMWbaS1KLNHp3+WZH8XBYabTRzat+rMg2qPmc06P8AE6pkGuhVQWBWJTQKUep780cGz9CdIo8l0hhfduVFUXxf1zVKohDTSc7RZoA/rhjZpCzptXu7e3pZypFWaEiNgI5/iO3n0ofXDLIs8Wk1+nILFZ0ICgdOb+udOeVEJaMqX/N6V6n7ZwfE9HNq52eKtxISi3IBqzRHoDhiVWjjR03NCoQOCaPQfv5YXW3oyuVtxpXK2++erbw9SSB3GCVx5XAK5ZWbCSmAUOO24JBzUrOiSpwSpxxGVXtl2zojacog5oK+2AQPTLtOpO3K2nHFRlbfTLtOpNHKK4+j3GDQ7rl2dSCmUVzRQyiBjsnVm2nKOaCFyioy7Tqz1lFbx/ljKMfvl2nUnbk243Ycmw42nUrbeEFIHTGbCMsA+mNnUnyicvyax3IyrONr1hPlHtk8tvTH0Tk2++OydSNp9MNFYmgpJ9BhlTfrmrThdPGZpVYHkDjoPXM559Ztvj47llpX4fytPuYBZDZBP8v7GZIlk887mj8t0N7262azRJMNaJk3hQh/N6Gv8f1zmywyieontSaJHBJr0zwZZdruvqceHWdY1QrvnMeoRm3WQL44xkaRRI8kR2kGuOOmWjBNIIixSRCSdx5HYfTMrahX0cgLKCCL3rXy+eZ26aSIvKjmaJmF8qSWsfX/AB64xooxRAdSAK8v4QBY7Dg/X/nOOo1UmrKmVVKg7vj+JV986uqm8jTxsZFBK7Q9k8+leuNrZGc+JzwFIkJ1hUkEIvxLZ68cf0zd5U0undm3bKsXzfOZ4ptRKiShBtVACxFGuhIB59v85u8N1TSq0exiFakauCLq8M+vMFMVTZ5m1rSmU9T9cLw2SEtIsf5eDXYe147yIpDuf4vh+I306cVlagbJFK0FQHaqj1/tlY3vw5nizyS6ZoYZAXdiW391Hb7VnmzBro4B5c0e1CVDLCfUgi249c9BG8hleSXTlCp5JP8AKO3z/fpjTCiQBbG9z8JA6jixkb/pxvANM8Mvma2XfLVohIAQHqa+ubdboodTIsyQxxQrySVC1zzx39c1RxmBoFdVtybcnpxXXLaBzqFVwau+nAHz9eBgYvxotdLBEJNygB6HA9T9M06XSxyu5GoMqJwY6rmvn6ZNSB5yNFEjbVO2Q2Ao6V73zz2y9PKNCiMyxiGUBmrkC6wMuvkPl7dMXKMQFjkY/EKv5/fNMOpCDTQs20x0CSelcV8zipYZhqyVIaMLZI6ir4zlao6iQSxQyUW4DLdg+uFeindPOMakBx8ZY8HmxnKl8qOZ5WU0ovcoB9iaOHDqRFAqxRiQooUAj4qB4v0/6xU80X4UvNCI2ez+bkg8j58nj5YSPYG8q8uzlE+2eh4lEnKvLvK4ypoJOVeEQMEgZdppV5V5fGUQMbNL3DBNHIR74Ne+UFQ9BlFR6ZVH1yUfXG00rbg7ecKjlc5dppRTK2HC5yY2aLK+2CVGMN5Ve+XadSyuUQMbWTbeXsnUismOCC8m30x2TqVk5xhXjtlbcbNA5yX7YVZKy7TQbHphIA7BSavvkrBZkU0zAGryWrI0nUQQ/wDjW3U0a69ecz6p5JnSIk+UeXZaB6dsWJoWJPmLfN314xUmrj8pvKO6S6C984WY+8q9M5Mp4xxZtXAYFMyFFnApDXBs9aGBNEUjWQMHmU7g0dn4uOudPQaaVNQdRqzGwFqou+b7f0++HqNQrCtPKN6ghgBRv1zhZv09OGWXy58k0s6RySxqrOpGwg7mzIwSBodRIxohiLBNXx09v7Zr18Wo2ByVIVA1kWS18r7cV985mtDyadUSSNpHPCqKAHv70BkdJWzQu41j6h132oT4FN+x5987HlM5eaUOoC8LVE38uhzD4G8emR9LMy/iF52sea6GvXNOslaQSRxBiF7pxXT/AJys33prDxHQUFoAFdvUiu2MKhIUjWPaqMBQ5pevbMPhpqYpITG7btsXQlenB/X650pbDNKDu4or6AZWCpJAku0D4eCST1Pr+mZ5dUHkdlLOCCg+EmiP0+uKQO7TrIVMLUsaKaI9f74CFIo5ZJbpKAAs19B36ZNrpzZtTJJBWmk2lZCStXYBPOamczLE4kZFKkyGqFfPD0s48oOqbjtJLsPyHuOnz+2RJEMTtJGm48gOSR71+uGj9NKvEjgNGxHlKaIUA+vY8Zk8aWaSCZo5iNh3exHp+/TDEn4jSg6eJY6X86nb/wDjfvmaeSWCDyZhxyQSO/z74SMuv8QZIoY33NM4A3JRAvNmgImVi0genogi6WuOD1+mIi0sbSxzyOdxIvapsDpXPp/fN8qLo5pDDUaGgGA4s9j6j/OFZ9TqG0y7huUN1U8nqeMxjw7US6STUDUGMyLvJCg/CP5fYX886JbT6hkeOpSw2ED4d3y9M6MelG1ARZCACiaP0xCuHpIERfxhUtJLxEoHAAFlqPPtXP64ufT6TULDEo3SmmIDcg+/oM6mpeeCdiwVx346enOUdRHPGySxcgE0rWT171x2weo7l5WVeVed3jXkysmUTKyZWBMmVzkvCIcEjLvKvBpVZMu8q8uzQcl5eTG00r65K98mTGzSUMEjLysGlZDkOVl2mkN5VnJlY2aS8l5BgTTxwg7zzV1jejRmQ0FJPQZzZ/FGjlVEh3CgSQeDYvjH/ixq9MxjRhX5h/TnM958L0rBrfE2inCi6IJ+H65j1HibtOyqKUptLdD0wvEI1IWWZlBHXqK/ftmaanCLX+6vAo8Oe3z7fb3zhbb7rtJJ6KhakYsdzm759azTpdY2meGRm5oFgeh9szbUd4G3bWFCS+37/vjGhGs2gACNTXP2znlPiNRun8afUuEc+WhYEKnJ63lRbhPL5nJkH5flyCPv+mZ9PoxpZf8AYbaxW/MDcL8gc6xikaBJnlDuvRjwV/zedJLIlu6xanVvqVjjVmVyFRlA9D0PrnRjSLTIGkYSkikZeQvY85ypFaTUK3mmKcH4lKn7iuMZp9Zp57jCERRkM1LuWjfQjoOeLGZlrUdFwyQJqoYhLIAK8zgqa6/e8Q8rhYY2fzWXh3jr4fT5nkcZsiiZUUEXFtsbT0Y33+R/Q5Xl6ZJfM2hytJuA680Pt/XK2VoRt1LGRGed05kJ616eg6fb2zoxSb0MYpW2DdRsA9CL9cCGISyB5bLpe0kcUelV88FhHEdskoG8nr1+p+vb1whqGB+oQEHkNzZHTA1jGSMxIdvwby4ApQenXMip+DkWVXd2DcqG7X/wf0w9SxdAB5scpBoJxffrhdMbb10xeLdNKG+MAcUel8enp3ya5vJQh0UyKN8ZUba+fPXnrj4NqmNEViu0BzJXPPO6jybGNDb55gQoVWF7+g+v1AwpGo1Wmh0sVgqSOQgvd2JvMq6vWv4lJBJHt04XdTfEWU3Z4+nGbJ4okfTmOBXcsaVjt3WeCOx/4wIINPp5Fhlmd5jUm0sSQebo1zxfGAmaXzSxWLZIODR5PNcHsecVrdbJJCkEUVIenxc8f9Z0dVOINO8McfxbgKXhue/9/pmGSeGCOGDdJuNuRQG4HpXc4qmeHtHoNWuxU2SkfE712/tZ4zRD4ws+q8rS7pixJaQLaRn0J+mBNBp/LjCJppNy7rPBY3Yr6X9cXp9dp9M50sMO1Cfj2p8hxX74wmttLQySxM0zOZauovhCj1q+vXMul0csMU7JqDPbiv5iB0PI+d5Gijkdis7RxKLNfFfb55NIjDSF9OCyIWCgvtBIvmv1AHrkV6LJk6jJnd5EyZMmBMmTJ1wKycZeTAGslZdZKygayVlnJg0AjBOVPNFAAZXCBjQvOZN47po+BZPPXjvmbnjj7q9bXTy84Om/iaDUa1YfKMaNQ3M3Nn29M7oYXVi/TLMpfSaSslYLTwou5pFA6XeBHq4ZpfLjYtfQgcZdpoZwbFXxXrnO8d8RbQRxqjBZHPBYcEdxnD/1eV5olFQxBHMgLfCW55+f98xlySNTC13NT4ksc0kaOqlF6nuT0OI/1pIi/nMG2DoOpvpnkJdYG1DbyXZmsFueKxgaNZATILYWFA4Jr+ucLy5xvrHqm8c02o2wRSbJm9cRL4kODMu5l4cjpX+c8gzMfMKb3Zar4en1GDB4jqJNQd+4qb3Lm95U1I73+pB3TzNgW/8A2sgd87ep8V0Wl0tQN5rtZIHJ471nidNI2r18URjDEt0B7Ub/AM5r1M224oYiFINGuSCev98xlnljesLJXUk8W00sSvPudozynBH7/wAZd6V4hrNMWTT7hujH8pB9D2/znBimmSBzK1hh8C1uNf4zT4PBrjukg07TLMQCegU2Df6ZrEbkkZZdQYW3sJSCTztUBufp/YZsj/8Ai6aNd26Wug5s9/pxycrSeBTxEyT6jY0hIkCc/CSDQ+3/ADnb03h8cVTovIP5j12+l+udIXGuSdUNOyvPveQ82K9Ow9MPUeMSNGq7NrAktXbN/iXhyyzxSIFHXdfT1vMz+EefH5sTJ+YG2FCq9Kznl23pqY/OmXSyT6lQ2njUOjfC+7ki+hHpzheEaTUx695ZITGw4LgcX1s/5rOlpPCtNpZBIGPncXTULquPpnQABl2RggV8XfEjUiE7lCs35wfiuqwY4h5ZQCitgOVNV6/0w2eNVIVlZbp7vqeb++W8zKQKKoOTt4q/X175pQwlYomJoxoOSeD8qxMkKq5Zy5kdhTXwB149uemUm0tJGrIHNl+nPHU+/wDgYRbYAqyMwTgqerdf7ZBQRGmDm3ojbfUsOfthRhr3t5YVbG1bN+v9v1xARfMjLSHadwKAEAn/AIJ7Y2KdjP5YgKIAFJbkAe3av7nphTPMF+aY2Za2lVW6F1ZGZWkVkLSJbI/C8iwLoj5DMC+IOfEWjLOq2WVgK2kAggm/XiuevtmxdQk7Ry2wk4NFaauPir0yINp5JjGwhJYdAx+t/MdMS7QzrsNGaNKkjItueSB9f6ZQgDzngn4eFHPoOp+eZPxKRSzRmzqHO4p+ajwK47VXv1wOoSuph89SikX6MK45PqcXqpYItQvmLvDA1trhuv8AnPNQeIeWHhWURqZAypD8JahXT53lazR6kMFWdjO9yb5qogGqvnp++2Da5Jn1WpjlMyNp7CxgsFaI3Q4HJH+c2t4zPEF0Q8yIzmhqpeKvoaPpnG0Ph2qTWDX6VI9SsLhg7flY/wDF37Vm7xXXaefXmGcu0rKFV0sBWBuvcc8n+mXTMrfLrPw27SNN5mnKbWkNb7vnkev984+i8Z1Gk1DKPNk05kJktb44AA+2XJEYZWSNYoWRFba5qyeOpPt+tYqTUPGWg1UZQuvHwgWa6H9Mzurt6U+KCJT/ALztuBZSCeeP+uMqLxyc6ctIJKWjdcGvf3yotJpwhZYxI+7hXc8fpnQj3zpxqEWOiNkQDc/s502dY5SfxgwmCyRqVLUeOgzvReMaWRFPmLuIugc5k/h+liKCPTxyG7K7Qd3ue2L0cen/ANyXUQwswA2hlHHsBjZcJR6Tx3Ua3UywyQiFACV3cMea9ec0eG+JAagpIHYMQgYA7b5wY1hm0sczxqlm1AUAgDNSKpjaVo9kY5tuC3HNVjafrdJpECMwNhetc557Va/VJ4gteYyv0TsOP398RP4nplmCwDYi3uAsd+vvhv401lEVQxYKGIqumLdrMJHWXxWOKBW1KupJIHw+mak1mnkg81JVZfY9M8zqPEFeSJfMEoJN2DyPYZvh1AncwwokSUaBW/rl3Yz0jNrdd4jNqWbSCQr0VUHHzP775enl8XvS/iCF3sSTwSvOdGErCm55t5BJJVQB74vzX1kHmRyLEl1bGzRF3WY231jF4qk8yyefMu4N8CrXH/PTPMeIRzLt3xsikHqb6Z6Rplm8QVIImcob8xieSOp+WYR4bLqtcJvEp1jSRuYS/wATX0FAcXnO4fy2lnjw4Wk8M8T1AWeCA7bDKxYDp0Is53tNp/F9dMTq707InwlXFA8DoM9CFi0ccUUEdKy7QtEkcdPthO4jZqDb2HLhbI/4zpaTHTh6bwXW8NqtUEq9oHxWex++dcRCBfgQMwAF0AAehNeuHUrPCiI2yJqeR2q/bMut8Ugj1SaZZI6Bsuegb044vEb8RzPHkn1GoWNoueiAsLc3/wBcYvS/w1poyg1RLyE2ybiFI+nvla+NNb4lp2jillhEm0yxt1a79Ogzu+Ky6mHRt+DB8xQOpoCz6/2xJ52mpbtyPFNP4dBA2m0yxxyuosgBm22Ol/IfbPOqw1Mh8ulSNiaTktzwPfO5/pon3S+ITBtPtskyEkNfNcn7X/jOf4dHFrfF/wALp08mMSbhdkmiOffpkyn0xl7bvDf4fmmlY+IMyQAAkXW6xdD5dLx/jXhGk1jxojHTyxj4do4C/wBPTOvNPBLq/KnYIIxSjdZ5rk18/wBcuOTzdSCIm3ncov0HTr8s1PDUkcjwDwhNDDIdQitJdKxPVT1I7j0/7zN4n4JqZ9Vv0kMKo5FliAK+V32z08kywRHZW7sWPJ/fGI0Go8+aVy26h1HUD9i8WbXrNPPaX+GWDbZpvKiVgtlDbmuvPa/6Z6TT6X8Jo/LhQAQihfHHcn9cOEJqJy4ahGA1cUB7+/bGy7ZiEvcG5N9CB6/XEiSSegQorxozIAG5N2T7fT2xgH4pgPywR+n83vmeXVx6eOKIKZHcbQPTvyOwwtVP5fh5nkA3gH4Q3XsDlUKamBtWYlG9q20Pn0zSSwcKNu26I7rmLQweVCjOzNKycXxtHr7dBjo9Qs4dI5A+wj4geR7nIlaWRn5UqBgSiovLViR3rDUhgQHZtvUjjr74LSraqFYHnbuBA4wQhJVhBEits/l469Lx7swgRrLMxBrrQxbwwmUu4DMOtngH1/pidXrIbMZoCqJJ4PNV075BnmErRlIULxXTlhVAkdL9PX3zayeXvZPLDAAABbI5uuMzS6tE0iTjeC/NGzWc0ePCGWtRKrRkH4iDuvnoB6WOMK6BhlMkzKrcHcFsdwP3z3zKYmnLSNLutmIVbFG+vXvmXXfxFHGiiOYQyc7VIsN866frnNj8ZMw088s8gid2UrtHwPfrfvixNx6CGCKSQIhCMFJYBuTR689eaGRIEjZ0ijCu4AZt+0k+/cdjnO0nivhYnXyNTI13tVgRZ9Sa9s1JroNYzNG8ShCPjIrj2Nevt9szo2ZPq00mmkUrt2MR8XJJPQg1XpmCaF1kcnWuikiljHxFSor62OvpeYNd4pDp/gd21Do5HxLTJ9e/I6++Dpta2pEizQTQqELeZzdC+L9OenvhNulJpYtXpf8AbR5lHDSORuBuya6ntYvoM26ZFZEWY3IEKk7PzAnnj3+X9M4uo18TIBpJNOFRdwjdHDCh0u774EPin4hYixeae7csKKmjdc8iunyy6NuvqbijGlj4jiAXg0SeOfp1+ucTUPpNPq2SM1MSALB/22sXQPHT5e/ObdRrk0ZAjcs3UMhskE2b/wA++cjVeXrZFG5IZC25NvNn34Hpl0lvwmgilbV6iebzZSjFSFbqOvf6HNnjcTSaWCdI5FL9dy0brqfXnF+E6vym1BUEqZxQI56d8DUazUarRpE3MZsKSxrrde+WpC9JqPGoa2eY1Ubez36c/PNmk1Hi+j1cuoZUk80ElA1gE+334xOm1Xik8iq1BWZQTQ4982x6rxHUTyRRJ8Ma0WPesluX0skVF4nq1R5E0z7ySrNzSizYAAv05zK+q8RR2f4iSbHB2gWeD6kivuc0LP4mY74NtRO3oLxY8T8S+EIaohar3P8AgZN5NNc/jep1GgEJ0zrIHFEJuFCuo97/AEzbrfEpJ/CIppoGUUAEB5JodPTm/tmGd/F4tGs0hUW1Ba+398169ddF4Yhv/wCQwt+ODxf98zvJp5qbU62d9yxFQPhCKl0Pn98GB9SdXF5kUkpUg0/A69zmiHxrXaUsm0bieQRmzS+P66fWRRyKgU9a4/fTN7z+nPx9s8GqmHhQhGgmeXlTKbvrdj09M1aTWy6SGNk0jNKy7XLglgR3uv3eMXxnXnQJq2SLa3bnpdeuPj8S8QkiicQodyFzRPAqxmLcvprU+2PWeJeKavw5bjKDlDt4u+c3xeJamLSSR6XRhQxVFYtfJHfjoPbFS+O6qHw9ZZNMgkZunbb/AN4467UQNLq5NOtqyxml429SQfrjeX0f65ul8R8Q0yyyPEJJJbQkLRj4FfTnHx+NCIrNp9DI8oP5pBzRvo3JxifxLNJB5q6RSNxDVxtAA/zhv/EGrVBI2gIBNCrs5N5fS+PsMP8AE06KUHhhEj1yG2jtybHHJ75Iv4j1CiaKbSSmmb40O6/SuPTvjF/iSUqrN4e+09SB09P64R/iQsGZdLIFUtyvestt+ia+z5PG/wAT/uRxzBYorYc9TfHI7eucBNfJLYbSPsj6eYaUD12gcnr1vPQx+Oh4Jmk08i7FDbTXxAg+3tmRP4m0kisGhYMvJUhT/bHbL6XU+2Xwfx5YNaYnTy9O387EkA+vpg+M/wARqNWo0rmZATvtuDz6/LNkH8R6KeURLomLseAFBy3/AIg8MibbNpWV1b+aIA5e1+k/15PW62RyYxHsjPO304/ZzveHaUeHx6bxCKWKWSUhSGPC2a479D1zUnjXgyzSGWOMqxBUeSOBQ/vnTTWeGGHzG09RuvBMdAj0xc79MzGfblP4sYvGCItKmoAWlZOWPSiSe3Tv3xUf8RatfEvM/AssJNyEG74PN9P+s7P4nwSaXawQuw4Fcm/2MCJ/AegTTgkUbXJ3/pdf25ev8b87UqukiLRjnzm5FEeh6VmDwrxLUaSdhMjS+aBEis9BjfBP6561f9JcEIumO5edpHIr/GDJoPCZWjHlQkKex/KPXr61icn3Fsv2V/DuvTUjUKxAQMFWMtyCFH3HT9c1xSxalROsnwcoF/KBXFc/vrk0vhvh2mPmaeNFYG9wx0WnhhVo4vhVjR5sdfT6Zf2RdVyxqofEfERp0miEZ+G1B3sR71Xrm7xLTxPpFijLBIgBsTuPTofTAXwXTJqd6kqlXtVit+oNds16nzEj3QKJHsUtgCsTOJqvLeI/xDLIyR6OHyiTzdMKPUEfU4vwzxjWQmOJ9ux+AD8NHj79+ud2HwCFolaVWD9xvuvrWFD4EmndWikZa9lPH1GTunWj8W8Wj8M0h3AGSgQgNE9v65Xhni0WqjRpJYzJJQAVTuugSP6nA1XhGnmctPNKzDm25rET+CKyKNPNVG6IrtjuvWub43/EOpimK6UKoPRiQwI7V8wD785gm8TJkM7BydpjZeANwN306UP1zrt4DNuNRp17vzmd/BJVUK6MRubp0NnJ+z+ksrjaqXUNCY4nJW2clv8A7UQfnVDKdpkmE04/2mcq27m+hr2sdOM6U3hcYc7n2mgNu3ngZc2kaVHQI3LRkDcAKVSpOP2xnThz7Z5QYo2ARCCtlud12PTDUgw6geTtVWSTjtzR/wD7Z2l8MSMFpWA+BhXXqp73/bDHhsY0moWM23lNfPUjn09sftlOrziEK0YWAjbISCXs7b6Zp0muliUKtvssFGY7SpFXXqOB9s6Pn+HpBcaKWIokCyMwPHDtO0uW/lIHT+mWcm/cT0V4i5kMU7ksZVs8c0GI79czsqPEzRGZioumFDr7HHSwSnTwCQcqXUfo398rTGSKaInlQ4JFe+dNxPkuHz0PnQsIww6swAP+cPRyeVIXeaNCp4tSb+WJkgZJ3Qg/CxH2x2njmI2pp43v+YpZH9slsPl0Z/EdFHuRo43KsRfl8309frnJ1kyzeV5PJjFWqbc3fgJNWzu06Ihc0N1Hr6AXjY9BAkLFW5BA3E8fv6Zn9mMN7J0mqk/0+fUJBGzj4WboQT3+vOYl1eqUqqyqqgkheKGdxdLpINNIjMpSReq9j+z+uIWCBQpSIuoH892xzM5cfpbt3Y2gjK0VDFs36V4YIXc0L/Mb9TmJ/D5JGZlU7h0tCP64+Tw2RtN5Sllc9T8P/wDrOul7QqbUweeoiK04NUwNnA0MCy6eW+GVrojnphaTwWdZA8khVRxdhj/fO7FofKjYK7NY75eq3OOdIU1Gigj4teT+tZs1kaavTbCfiXgEfLFppSENxm7/ADURf64/w+EU28Natx27DJ1P2R5XVeGsuqphZIH7/XK/05o5lZVAKue/NdM9jPpkclud3yvOWI2k1bAo6xg/zRkDr9stliTKVxJtGwMOnAGw/COenOdXQ6QaZ33kFQoA5sdKzr/go2VTfI6dsbNCWiNKpavU4uJ2m3M1Ogh1ul2BOqlRXGEFH+m+TOoLtx09sQp10Gp2GD4OaYGuMbMJX1mmQrQZbam4v75nVa7RytLEull1GnljG2RSRY9v+M1eGaiGeaIFlbg2pHQgf95l8X/+NLvuyDZo9Oueck1Tw6nzktX5IIo9czvd0XLT38mniVfKZFIeug6CsQmkhgiMKoKBPcdDnL8O/iFJdOplJ3KoW3KjkD04zpaLWHV/iBIVC8VRB7+xOXSyw7VaeGeT4KLbSgA/fvnmJPC5k1JjaMqW6llNX9s9SsokkgfcF8scgNd9cmpSKWVHag6kC/nlXW3F8B0On0ureXUD/e3lE4r64Xj/AIRDJqF1L7VC9eKvM+vfb/EEDij8VemdnxgHWQeRGpDmurbRwfWj/TCf08VrvC2AScKqhiPhLge3rnX8I10ni08GhfahguSwvBIa+2VFqJfDNQ66ljJGyVW7pz7/AOM53huuEHjH4mEUrSV03cH7YtY9V2NR4RDq/HCWlaEVYUD8p4oX9czj+FxJ4nGquxjBIYk+gP8AfPRSRINR5hAKyUeR06H+2LWRNPrdhIDIpbuep4/rjdb6xwfEPBfwmrjbSsSp+DaO4o398weFeG6nVzEhyojCubPHXpnsJlTUxs0W1nB4J7c++L8K0w002piK7Qy8H6n/ADlOsYv4f8KbfM8ssjICQF3cEFQb+5OP8M8Lli07vqJ5XZ920WRt9D9s6elAgLooG+vTg8Vi90qTrt+EMtkdQK6jJpdPOeHz62DxRY9S8sgeR0Wm7AX3656PVaeTU6dlTUtG+4MpoAj985k1epOn1UUqRBpDW0sOOnOaPENaI9DHM6gFltq7djWTUT05Ph/j8xmTSzwkvuZQ9/mqz/bOtF4rDMXgVysiAgg9qr/OYJvCoon08+mLt5ZLDcAOKPt7nEs/4maSbRDazKTIHHRiAOOv/reLhizvKPQxayOTgEMa7emEXi2s24KSO/GeQ8VXX6XVCSFAitwCDYNsSP6jNHh/jQ1kUkc58mVDQ569OR275zuNjUsekkDBRs3NXBIqz9MV5hWtxBDdGHT/AIODptZ5km2QAbje++vpjZooyrN+UtwdvQ++ZaTkijyPcXgtEjAho0o+1ZURULQu8YKxpds0nh8D804//acTNpIwhCuEToSwu86HGUVB7ZnqeHn30sCf+MRMQLNAX/TFmJAf/GhPH8ud6XSwv+aNT8uMxz6aKI2Ud1PYHM2VLHJ1mmR9JCaUDziGJHqp+XoMGPw7TL0O5q6en6Z1jBGyq7OEF8KVHGNiigAtGDcfPnHlOrhyRiPX6lBEm7zCbK2aIB/uca7SFNqqq8dqs5tl0rNJSswB5Pv+mLfSMrbw4AIqq/4GTLzdpcXNaDTuArhiw/8AUUfvjlTRxItKFI53luuMkgJsllBJ46f35xLaeNSCz7m7Wcn+s6EusgQn4gwHXg8d69MqTxNthMelWjwCzD+2VHBfxlV2+rPlSyxhvhVieRfPr6HJ1m2a9pQPVRlsqsKIFYN4V59NyKXR6ZW3DTx7vXaM0Djpg3kwojyMpBtv3PreS8l4QV4IRQSQos98l5LygryXgXkvAB9NA77miUt61liMI4ZTQAraOmXeUWwOZ4t4a+vYVMqjv/tAnp655vUfw7qt53IjAj83xH9Fz2pN4BAPXMXCb2u3h/DfBGbxFUklACtuI8lz/Vaz2cWkKuW/EPRFBQqiv0wkhiR96xoGP8wUA4281Im2DU+GsdjRyKSp6lBf6DC08ExJWRdtAcnpf9c3bsrdjrGplY8h/E0TRa6NvgsjcPLO1u/vz88RB4lrIhErSRihu2vIGYiuh6f1z1et0UOs2tKLZOQdxH9MwJ4ZowyssUQDRlKVW6ff2zNxWZ1wfEfEfxEBcwSRy2PiIpfl1Jzit8M1pYFk8850NT4WV1jjT6eSVPXy2QD74nUaOSImRgiKONqsSazndrbtp0fj+rjmHmSBobAZaA7V2GbPHfFIo9RDJAAzstk2ymvt04zgRRpJLsaTavqBeG2niDFt7swuhtoD9M1DtXf8E8WE8Twyswd2LLukvgC65N9sHxDx94NUFiMUiAA3V/qCM87GpEyGOgQT3w54vLlNA2OD0I/5zNvle109Pp/4jgklQTKyAuGDGqA+md15hLp5ZVb8hsWOorp9c+axb1QtyCDweeM9J4b4zM+hp9K77QFMoa7r598rWOX29Iph1WniEoAaiF56G8qRE1Hh76ZRYWw3seT0zm6PxNZYwVhO7dYs9yPWs2LrAg85Q4X/APUXyyfrx1w3uFeHauSWoZVHwRkLY5PscvTg6bc4iqNj2ql/X1y98LakSBabYSCLU9b6fbG6iYxqG55NdKIOKg9bDHNo1LKdgoAXR9qzzPimjaOVv9vadu7cOOKz0SozMzqzbHF7eg7dvXMM8Ep3ylaYflNg8fe8gwaLxQllhk4YcCuN3Oel8MmE2kC7gdvH/wDHOD/pcOtQhf8AbmHxrtNhhx75u8JkaHXCA0QykE+/Wv365zymvMWN6A7nPvjQx74pDUjrfSh+mM4yKLdl7sHoMgORR3eUaJ6c5V5LwLAHSry2iB6CsHLBI5s5NLsttOqjcbr2F5m1BUrSQzMfUKQDnTVgcjqrDkBszpXmpYgytJSoBwd3HzxYh3oSuwX3rt+udvUabRp+eI2RwFUn+mYXjR6WKLy26gtYv75GLi5yaaGJyxcWCQoCn75PKUDeGXkdWYj9c6Q8N1B/MVonn4vv2zO/hXkoJGeJQGqz6evzwz1r0gIyw2LvCBGfQecwNl3iwR65e4euEHeS8DdkvKDvKvBvKvALdlFsEsPbALjAZuGUWxe8ZW/2wDLZV4G7K3YDbybsVvHvlbxgO3ZRbFFh64O8YDt3vlFsT5g9Mhce+VFvGrm23dK4cj+hxZ00FswiUsepYXf3y/N56ZN+NG2fV6UyaYrCqo/H5fhzmzaLUxoo2SykCy13zXtna3+2UXsEdMlx2beTk0LQSoV0z3wQSSeftm7xXTtq9LEJNgkRTbMOf0NZ1m0ySOpaSX4aoBqGL8Sj3R7gLNUTV5nr4Xby8mhSOFF8xyrWSxFAfushpAiBzSGgTR7/ACxmrkJGyQckc++KZlCrv4c2Tz9uO2YaXHMTIshYxhpNwe+hJv8AuMek34hXWV7lIpux6/LMRIAhQkmhbeg6cfpluQJPMDkFuvOXeh1VmljZEV2FLxzZo/MYZndJVDSSbLrbu/tnMhlViwLAt2LNVdembQ6rpBFJIGcnoOuNSw3Y7f4gQoshBLEWRZ78Y/aJLJJU9aarBzzkPi0kcoV3BiqtrV1uuvyzpabVCTypkYKGDCjfF8/X/vMO0rPPqJdPrdv80YosPl/jJ4bO58ahDMRbNYI71/1jdTpU1T7y5+EbVZaU2OK57YnQRtpfFYUZwx38naMl9K7zWuqb0vG7gczM/wDuEk1z1wo3vOTbQKPfLAOKu++GD6dcBgGSsEHLvAvJk65d8YEquuHuPTB3D0ydcimLyOeQcVJo9O5tox9OMscflNYxTfHQ5NAdlAAGszzeHxTyF5GdiRXB6fLNhyvpkaZt2EDirywT6573hOB9svcB6DEn6n65W49gMIdvHqTk3HsDidzdyBk3f+zHKGkv/wC1ZV+rXiTKg98H8QvbAeTlXiDNfesrcP5n/XAfeCXHriDPCve8W2sXoqk4GrcPfK3E9MxHUOf5a+uQSP8As5dJttPv/XK3qMxGZu5wd99TjRtsMy+owTqFHpmSx6jKseuXSba/xBPTKMx7j9cyF1HfK85e3OE21CX/AOuX5remZPNY9BWTe3dsptr8y+uWHX0zIGv+bDBP8uBqDe+TcPXM+5++Er+pxpNuXqPDtSZy8e1w3/PvmTXaHUNKhJohBYPYAZ6MSehGCWs3ak9MxeONd3j1gdQ29G4J7emBLG1JZFd6z2LEjoMx62NX0soWNA1WOO+Zy47r2sz8vMwxoZAxYKVI5POPYbp97D8hv5YmRZIzYUg9+MtZQEcsLLVzVAZiemwz72+Mn5D0HTNOg1Mqvt3EpfIPT2zDJKGXat9a+WbdFFU4WaI+XINocNQB+f34yeljtJI0Rti2xixYN3HfNOmjSXULqBYKoTfY3wPTtecAnUpI0UoYLtNFhfPbnO/4V5kegVpPzP2HFAcD++Zy9O08tIQk2WGNVTxtNYCsSL457Yxeei/XObQha3eWPfLXae/T1ywoF1gQHk84a9K65QFH1GEOBRwquo98Lni8l5KyCZYb3yvrk+eAd5L4vBseuWMKvzGQfENy96HIxhIKhlNg4v71lUVJZOp6g9DkGD8Sg6c5PxBOY7r0wTIf/bPc8Td5pOQzgfzDOeXJ7nKBwN51I9ScWdReZSfcZRdR1bKjSZhg/iAOgzKZV7ZW89hgaG1Jr0xRnJ74ok9wMXYvrhGjzO+X55HpmfcMoyKMo0+e2TzCe5zN5/oMAzH1wNob1IyGRO7E5gM3qcrzRhG4zL2BwDLeZRLfTLLnAfvvvk3e+IDcZReso0b/AHyw+ZPMrvk80euEbRJjFnAHU5gEo7DCEnHTKN3n3/3k80nuMwXzlhwMMt4kA6m/lhbiRYGYBNXTK889ico2NKwNcffAMhPesy+YT1ORpNuBWvTfpybFr0zitxEeCLIGddtQaquMUdhAGxau6rOeWG7tvHLUYdM4WcquxL53N1FX646fWN54AkUrQNsLr0/rhahAynYoDHr75lSJzISEv4hwc53HTrjk6/h3majam9XBYAWSD9v1z0Bgp9i8ovAPsM5HgMAbViYoiNEhBAHJN11+V53d33zjk74lCP3PzxqoK4Yj54VX7HKA5/zmGgkV1OQEAWMLr88GuOcKcrcdftksn5Yqvf7YY9CfoMA+br1ywcDcB0OFfp698gsVQrK/oOcn65eBQF4XywSLPGX9cAhzeT9MoE3l98K8uZuepOD5jHoKwDKB0GAZvQZ7niO3n1yi59cQZCcEufXAeW98rcB1xG+8rccI0+bXTBMxPfM26+py9wGA/eT3yrOJ8w9sEynA0bqwC2IMhytxwHFvfJvAxN5LGVDdwy9w7DE2Ml4DvNr0yeacUOmQmsGjPMb1ytxPU4AN5N2AeTFl675XmYDway/MAzL5hPfKZzhNNJms5Xm++ZNxyw2XaaaxIfXL80Dqcyb675N95dmmrzvTKaa8zXkJxs0cZLyi+J3ZW7C6NLZFlKH4T1xO7DgjaedIk5ZyABkqx6rwSMQ+HhnPxTEt9P3Z+ua7uzmcyCMiNb2oAqn1oVeA8zPwnHTPFfN29k8RsV16cHIzcCvviFcnkkLx+mFvBXjv3yKaDxyMjNZIUc9zlD1vLqxYPXjILXmuTeM6dcD4lIOQFt1UKwDFetHJZB/zlbhtuuuUW4o9ThR7jl8H2+mK3c9R17YY5PPHpkBlrvtkvKr3+WDs292JwD5rveWCaoEfXFre6wRWEDzfcd8DxxOVlFxgGSs9rxjyEgYkuT3yrwG7xglsXeVuwGWcgOLL1lF8Bt4JYYovlF8BhbKL1ii+Xuyg92QNgXeTdWAzecsHjE7svcexwHB6HOQuMzEnKs4GjzQOBg+beIvK3YDy+DuxW7KvCG78LeCKIxF5YasB1jtlE4sSZN+DQ7ybsC8l5TQ95yB8WcG8Gj7vBJIxW45e4nrg0PdnW/h6MPqZJmNCJeD7nj+l5xs9N4ZpzptCsbAbpakNHnpxx8ufrmOS6xbwm63H4bJIJF0D1wSgLkhSOf5cDdt+EdOAAP37YSIxBU8EG79M8z0GBeeTQPr/AExijgMFxdU3rXpzZxgDeg9x6YF3usdOMbG5FgAEHveLF2D0vmjhEheAaF9DzkUxXs//AFPpkDbhuA49sWxBBUV6XkB+KxfHWsB26zY5oZV1YDVfSz0wAdw6897y6BvjnsMgLcD1P1GErDYKFjpyKrBAZeDz8zliwPiG4VR4wpoPRgR65e6h16YsEbTVkHLND4SaIN84Fkeldu/bJuodeh9MGh/LZoXf79shNLwavIPEF/TBJyspjWe14xXlbhiyScq8KZuGCXwLOTvhBXgnJlMeMKq6yrwScmEWDhA4u+csnCiLHJuwCcEk4Dd2TdzibOWCcBwYEVlEe+KvJZ9cAzg3lBjXXKOEFeVeVkwCvKvByZQV5N2DlXgHuybjgZMGjA2UTg5LwCvKvKOWMDX4dp/xetjjb8l7nPoo656e0P5VpRYBKgHp7D91nI8ARQjPXxPIIyb7df38hnUtg1hiDuq+/wC+c4cl3XbCahijb8JQc8mybP3xp7/CAenoBxkiTfHuJNlaPPYVlbyu00O3X5ZzdDCzWSSeet4YKgU/1xbf+O+7EA5K/wBxlJsE1z8sBtmiTyOepr6/rhHrQIs9wOuZ1FlO1k4cYLCtxA6cZAbLQAs2OfS8NSSfQDpz7YCHdsB74LsfMAHHNcfXCmgAVzyB1vCXrx9vbFkbiQSfhHr7X/fGRncpv1yA1IqjzwcLnbx685Q4NduR+mW3Cn2rChNHsBfS8taax09sijjqTXr88FuGFcW1YBLTXXFcZZAZOL49cX0UV35/TDB+L61+mQf/2Q==";
}
export const dummyDataKeeper = new DummyDataKeeper();