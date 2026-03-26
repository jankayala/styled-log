import { styled, type StyleName, ANSI_CODES, type StyleOptions } from "./styled";

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Success = "success",
  Warn = "warn",
  Error = "error"
}

const levelPriority = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
};

function format(message: unknown): string {
  if (typeof message === "object") {
    return JSON.stringify(message, null, 2);
  }
  return String(message);
}

function timestamp(): string {
  return new Date().toISOString();
}

export class Logger {
  private currentLevel: LogLevel = LogLevel.Debug;

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return levelPriority[level] >= levelPriority[this.currentLevel];
  }

  private isStyleOptions(obj: any): obj is StyleOptions {
    if (typeof obj !== "object" || obj === null) return false;
    const keys = Object.keys(obj);
    if (keys.length === 0) return false;
    return keys.every(key => ["color", "bgColor", "modifiers"].includes(key));
  }

  private levelColors: Record<LogLevel, StyleName> = { debug: "magenta", info: "blue", success: "green", warn: "yellow", error: "red", };

  private leveledLog(level: LogLevel, msg: unknown) {
    if (!this.shouldLog(level)) return;

    const color = this.levelColors[level];
    const label = level.toUpperCase();

    const prefix = styled.bold[color](`[${label}]`);
    const time = styled.dim(timestamp());

    console.log(`${prefix} ${time} ${format(msg)}`);
  }

  log(...args: unknown[]) {
    const hasOptions = args.length > 1 && this.isStyleOptions(args[args.length - 1]);
    if (hasOptions) {
      const options = args.pop() as StyleOptions;
      let s = styled;
      if (options.color) s = (s as any)[options.color];
      if (options.bgColor) s = (s as any)[options.bgColor];
      if (options.modifiers) {
        const mods = Array.isArray(options.modifiers) ? options.modifiers : [options.modifiers];
        for (const mod of mods) {
          s = (s as any)[mod];
        }
      }
      console.log(s(args.map(format).join(" ")));
    } else {
      console.log(...args);
    }
  }

  debug(msg: unknown) {
    this.leveledLog(LogLevel.Debug, msg);
  }

  info(msg: unknown) {
    this.leveledLog(LogLevel.Info, msg);
  }

  success(msg: unknown) {
    this.leveledLog(LogLevel.Success, msg);
  }

  warn(msg: unknown) {
    this.leveledLog(LogLevel.Warn, msg);
  }

  error(msg: unknown) {
    this.leveledLog(LogLevel.Error, msg);
  }

}

const baseLogger = new Logger();

function createLoggerStyled(styles: StyleName[] = []): any {
  const fn = (text: string) => {
    let s = styled;
    for (const style of styles) {
      s = (s as any)[style];
    }
    console.log(s(text));
  };

  return new Proxy(fn, {
    get(_, prop: string) {
      if (prop in ANSI_CODES) {
        return createLoggerStyled([...styles, prop as StyleName]);
      }
      return undefined;
    },
  });
}

export const logger = new Proxy(baseLogger, {
  get(target, prop) {
    if (prop in target) {
      const value = (target as any)[prop];
      return typeof value === "function" ? value.bind(target) : value;
    }
    if (typeof prop === "string" && prop in ANSI_CODES) {
      return createLoggerStyled([prop as StyleName]);
    }
    return undefined;
  },
}) as Logger & typeof styled;
