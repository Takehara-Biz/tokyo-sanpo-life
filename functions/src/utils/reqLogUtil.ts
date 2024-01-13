import { TSLThreadLocal } from "./tslThreadLocal";

/**
 * Proxy class for logging for request.
 */
export class ReqLogUtil {

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
