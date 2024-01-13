/**
 * Proxy class for logging for request.
 */
export class TslUtil {
  private static dateFormat = new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      // fractionalSecondDigits: 3,
    }
  );

  public static yyMMddHHmmss(date: Date): string {
    return this.dateFormat.format(date).replace(/[\/\s:]/g, '');
  }
}
