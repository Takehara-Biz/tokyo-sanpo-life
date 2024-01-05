/**
 * Provide utility functions about logging.
 * 
 * If you would like to see timestamp with log, do it with Chrome developer tool.
 * https://qiita.com/mr_t_free/items/2ead62d935121b483df3
 */
class TslLogUtil {

  public static debug(message: string): void{
    console.debug(message);
  }

  public static info(message: string): void{
    console.info(message);
  }

  public static warn(message: string): void{
    console.warn(message);
  }

  public static error(message: string): void{
    console.error(message);
  }
}
