/**
 * This module provides utilities for working with Standard Schemas synchronously.
 * It also exports asynchronous versions of the utilities with an `Async` suffix.
 * @module
 */

export * from "./common.ts";

export * from "./lib/sync.ts";

export {
  parse as parseAsync,
  safeParse as safeParseAsync,
  validate as validateAsync,
  //
  decode as decodeAsync,
  safeDecode as safeDecodeAsync,
  //
  parser as parserAsync,
  safeParser as safeParserAsync,
  validater as validaterAsync,
  //
  decoder as decoderAsync,
  safeDecoder as safeDecoderAsync,
  //
  pipe as pipeAsync,
  PipedAsyncSchema,
  //
  wrap as wrapAsync,
  WrappedAsyncSchema,
} from "./lib/async.ts";
