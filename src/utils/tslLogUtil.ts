/**
 * Proxy class for logging.
 */
export class TslLogUtil {
  private static dateFormat = new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      //fractionalSecondDigits: 3,
    }
  )
  private static date(): string {
    return this.dateFormat.format(new Date());
  }

  public static error(message: any): void {
    console.error(this.date() + ' [ERROR] ' + message);
  }

  public static warn(message: any): void {
    console.warn(this.date() + ' [ WARN] ' + message);
  }

  public static info(message: any): void {
    console.info(this.date() + ' [ INFO] ' + message);
  }
  public static debug(message: any): void {
    console.debug(this.date() + ' [DEBUG] ' + message);
  }
}