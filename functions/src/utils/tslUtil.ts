/**
 * Proxy class for logging for request.
 */
export class TslUtil {
  private static dateFormat = new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      // fractionalSecondDigits: 3,
    }
  );

  /**
   * GCPのコンソールで日本の日付が出力されているため、不要っぽい。
   * @returns
   */
  public static dateStr(): string {
    return this.dateFormat.format(new Date());
  }
}
