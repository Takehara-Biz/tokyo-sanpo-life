/**
 * Proxy class for logging.
 */
export class TslLogUtil {
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
    console.error("[ERROR] " + message);
  }

  /**
   *
   * @param message
   */
  public static warn(message: any): void {
    console.warn("[ WARN] " + message);
  }

  /**
   *
   * @param message
   */
  public static info(message: any): void {
    console.info("[ INFO] " + message);
  }
  /**
   *
   * @param message
   */
  public static debug(message: any): void {
    console.debug("[DEBUG] " + message);
  }
}
