import type { PngOptions, JpegOptions, TiffOptions, GifOptions, WebpOptions, AvifOptions } from 'sharp';
import type { Config as SVGOConfig } from 'svgo';

interface Options {
  test?: RegExp;
  include?: RegExp | string | string[];
  exclude?: RegExp | string | string[];
  includePublic?: boolean;
  ansiColors?: boolean;
  logStats?: boolean;
  svg?: SVGOConfig;
  png?: PngOptions;
  jpeg?: JpegOptions;
  jpg?: JpegOptions;
  tiff?: TiffOptions;
  gif?: GifOptions;
  webp?: WebpOptions;
  avif?: AvifOptions;
  cache?: boolean;
  cacheLocation?: string;
}

export const default_config_image_opti: Options = {
  logStats: true,
  ansiColors: true,
  test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
  exclude: /((fav)?icon)\.(ico|png|jpg)$/i,
  include: undefined,
  includePublic: true,
  svg: {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupNumericValues: false,
            cleanupIds: {
              minify: false,
              remove: false,
            },
            convertPathData: false,
          },
        },
      },
      "sortAttrs",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
        },
      },
    ],
  },
  png: {
    // https://sharp.pixelplumbing.com/api-output#png
    quality: 100,
  },
  jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 100,
  },
  jpg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 100,
  },
  tiff: {
    // https://sharp.pixelplumbing.com/api-output#tiff
    quality: 100,
  },
  // gif does not support lossless compression
  // https://sharp.pixelplumbing.com/api-output#gif
  gif: {},
  webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
    lossless: true,
  },
  avif: {
    // https://sharp.pixelplumbing.com/api-output#avif
    lossless: true,
  },
  cache: false,
  cacheLocation: ".cache/vite-plugin-image-optimizer",
}
