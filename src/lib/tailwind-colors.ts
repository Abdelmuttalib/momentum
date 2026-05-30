type Shade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type ColorShade = {
  [shade in Shade]?: string;
};

type Color = {
  name: string;
  shades: ColorShade;
};

export const defaultTailwindColors: Color[] = [
  {
    name: "pink",
    shades: {
      500: "#ec4899",
    },
  },
  {
    name: "red",
    shades: {
      500: "#ef4444",
    },
  },
  {
    name: "yellow",
    shades: {
      500: "#fbbf24",
    },
  },
  {
    name: "green",
    shades: {
      500: "#22c55e",
    },
  },
  {
    name: "blue",
    shades: {
      500: "#3b82f6",
    },
  },
  {
    name: "indigo",
    shades: {
      500: "#6366f1",
    },
  },
  {
    name: "purple",
    shades: {
      500: "#8b5cf6",
    },
  },
  {
    name: "stone",
    shades: {
      500: "#78716c",
    },
  },
  {
    name: "lime",
    shades: {
      500: "#84cc16",
    },
  },
  {
    name: "amber",
    shades: {
      500: "#f59e0b",
    },
  },
  {
    name: "emerald",
    shades: {
      500: "#10b981",
    },
  },
  {
    name: "teal",
    shades: {
      500: "#14b8a6",
    },
  },
  {
    name: "cyan",
    shades: {
      500: "#06b6d4",
    },
  },
  {
    name: "gray",
    shades: {
      500: "#6b7280",
    },
  },
  {
    name: "sky",
    shades: {
      500: "#0ea5e9",
    },
  },
  {
    name: "orange",
    shades: {
      500: "#f97316",
    },
  },
  {
    name: "violet",
    shades: {
      500: "#8b5cf6",
    },
  },
  {
    name: "fuchsia",
    shades: {
      500: "#d946ef",
    },
  },
  {
    name: "rose",
    shades: {
      500: "#f43f5e",
    },
  },
  {
    name: "zinc",
    shades: {
      500: "#71717a",
    },
  },
  {
    name: "neutral",
    shades: {
      500: "#737373",
    },
  },
];

function extractColorsWithShades(colorsArray: Color[]): {
  name: string;
  shade500: string | undefined;
}[] {
  return colorsArray.map((colorObj) => {
    const { name, shades } = colorObj;
    const shade500 = shades["500"];
    return { name, shade500 };
  });
}

export const extractedColors = extractColorsWithShades(defaultTailwindColors);
