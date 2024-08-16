import StyleDictionary from "style-dictionary";
import { usesReferences } from "style-dictionary/utils";
// import trans from "style-dictionary/lib/common/transforms";
// const StyleDictionary = require('style-dictionary');

// StyleDictionary.registerTransform({
//   type: `value`,
//   transitive: true,
//   name: `myTransitiveTransform`,
//   matcher: (token) => {},
//   transformer: (token) => {
//     // token.value will be resolved and transformed at this point
//     return "test";
//   },
// });
StyleDictionary.registerTransform({
  type: "value",
  transitive: true,
  name: "myTransitiveTransform",
  filter: (token) => {
    return token.path.includes("tw");
  },
  transform: (token, config, options, vol) => {
    return StyleDictionary.hooks.transforms["color/hsl"]
      .transform(token, config, options, vol)
      .slice(4, -1)
      .split(",")
      .reduce((a, c, i) => a.concat([...(i === 1 ? ["deg"] : []), c]), [])
      .join("");
  },
});
StyleDictionary.registerTransform({
  type: "value",
  transitive: true,
  name: "toRGB",
  filter: (token) => {
    return token.path.includes("tw");
  },
  transform: (token) => {
    if (token.attributes.category === "color") {
      return { ...token, type: "color" };
    }
  },
});
/**
 * @type {import("style-dictionary/types").Config}
 */
export default {
  source: ["**/*.tokens.json"],
  // hooks: {
  //   transforms: {
  //     "color/css": {
  //       ...StyleDictionary.hooks.transforms[`color/css`],
  //       transitive: true,
  //     },
  //   },
  // },
  platforms: {
    css: {
      transformGroup: "css",
      // transforms: [
      //   "attribute/cti",
      //   "name/kebab",
      //   "time/seconds",
      //   "html/icon",
      //   "size/rem",
      //   "color/css",
      //   "asset/url",
      //   "myTransitiveTransform",
      // ],
      transforms: [
        // "toRGB", //
        // "attribute/color",
        "myTransitiveTransform",
      ],
      prefix: "sui",
      buildPath: "build/css/",
      files: [
        {
          destination: "_variables.css",
          format: "css/variables",
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "build/js/",
      files: [
        {
          destination: "variables.js",
          format: "javascript/es6",
        },
      ],
    },
  },
};
