import { TSLThreadLocal } from "./tslThreadLocal";

/**
 * Proxy class for logging for request.
 */
export class ReqLogUtil {
  // private static dateFormat = new Intl.DateTimeFormat(
  //   "ja-JP",
  //   {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     // fractionalSecondDigits: 3,
  //   }
  // );

  // /**
  //  * GCPのコンソールで日本の日付が出力されているため、不要っぽい。
  //  * @returns
  //  */
  // private static date(): string {
  //   return this.dateFormat.format(new Date());
  // }

  /**
   *
   * @param message
   */
  public static error(message: any): void {
    console.error("[" + TSLThreadLocal.currentContext.requestId + "] [ERROR] " + message);
  }

  /**
   *
   * @param message
   */
  public static warn(message: any): void {
    console.warn("[" + TSLThreadLocal.currentContext.requestId + "] [ WARN] " + message);
  }

  /**
   *
   * @param message
   */
  public static info(message: any): void {
    console.info("[" + TSLThreadLocal.currentContext.requestId + "] [ INFO] " + message);
  }
  /**
   *
   * @param message
   */
  public static debug(message: any): void {
    console.debug("[" + TSLThreadLocal.currentContext.requestId + "] [DEBUG] " + message);
  }

  public static jsonStr(obj: any): string {
    return JSON.stringify(obj, ReqLogUtil.replacer, 1);
  }

  /**
   * put the 2nd patam of JSON.stringify(value, replacer);
   */
  public static replacer = ((key: string, value: any) => {
    if (key.includes("ase64")) {
      return value.substring(0, 30) + '...(' + value.length + ')char';
    }
    return value;
  });
}
