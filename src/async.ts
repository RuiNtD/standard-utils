/**
 * This module provides utilities for working with Standard Schemas asynchronously.
 * It also exports synchronous versions of the utilities with a `Sync` suffix.
 * @module
 */

export * from "./common.ts";
export * from "./lib/async.ts";

export {
  parse as parseSync,
  safeParse as safeParseSync,
  validate as validateSync,
  //
  decode as decodeSync,
  safeDecode as safeDecodeSync,
  //
  parser as parserSync,
  safeParser as safeParserSync,
  validater as validaterSync,
  //
  decoder as decoderSync,
  safeDecoder as safeDecoderSync,
  //
  is as isSync,
  assert as assertSync,
  //
  pipe as pipeSync,
  PipedSyncSchema,
  //
  wrap as wrapSync,
  WrappedSyncSchema,
} from "./lib/sync.ts";
