/**
 * This module provides utilities for working with Standard Schemas asynchronously.
 * It also exports synchronous versions of the utilities with a `Sync` suffix.
 * @module
 */

export * from "./common.ts";

export {
  validate,
  parse,
  safeParse,
  decode,
  safeDecode,
  wrap,
  WrappedAsyncSchema,
  pipe,
  PipedAsyncSchema,
} from "./lib/async.ts";

export {
  validate as validateSync,
  parse as parseSync,
  safeParse as safeParseSync,
  decode as decodeSync,
  safeDecode as safeDecodeSync,
  is as isSync,
  assert as assertSync,
  wrap as wrapSync,
  WrappedSyncSchema,
  pipe as pipeSync,
  PipedSyncSchema,
} from "./lib/sync.ts";
