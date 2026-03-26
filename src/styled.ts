export const ANSI_CODES = {
  // colors
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  lightGrey: [37, 39],
  lightGray: [37, 39],
  grey: [90, 39],
  gray: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  white: [97, 39],

  // background colors
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgLightGrey: [47, 49],
  bgLightGray: [47, 49],
  bgGrey: [100, 49],
  bgGray: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhite: [107, 49],

  // modifiers
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  overline: [53, 55],
} as const;

export type ColorName = 
  | "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "lightGrey" | "lightGray" | "grey" | "gray"
  | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "white";

export type BgColorName = 
  | "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgLightGrey" | "bgLightGray"
  | "bgGrey" | "bgGray" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright"
  | "bgCyanBright" | "bgWhite";

export type ModifierName = 
  | "bold" | "dim" | "italic" | "underline" | "inverse" | "hidden" | "strikethrough" | "overline";

export interface StyleOptions {
  color?: ColorName;
  bgColor?: BgColorName;
  modifiers?: ModifierName | ModifierName[];
}


export type StyleName = keyof typeof ANSI_CODES;

type Styled = {
  (text: string): string;
} & {
  [K in StyleName]: Styled;
};

function createStyled(styles: StyleName[] = []): Styled {
  const fn = ((text: string) => {
    return styles.reduce((acc, style) => {
      const codes = ANSI_CODES[style];
      if (!codes) return acc;

      const [open, close] = codes;
      return `\x1b[${open}m${acc}\x1b[${close}m`;
    }, text);
  }) as Styled;

  return new Proxy(fn, {
    get(_, prop: string) {
      if (prop in ANSI_CODES) {
        return createStyled([...styles, prop as StyleName]);
      }
      throw new Error(`Unknown style: ${prop}`);
    },
  });
}

export const styled = createStyled();
