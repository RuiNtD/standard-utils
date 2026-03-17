/**
 * This module provides utilities for working with Standard Schemas synchronously.
 * It also exports asynchronous versions of the utilities with an `Async` suffix.
 * @module
 */

export * from "./common.ts";

export {
  validate,
  parse,
  safeParse,
  decode,
  safeDecode,
  is,
  assert,
  wrap,
  WrappedSyncSchema,
  pipe,
  PipedSyncSchema,
} from "./lib/sync.ts";

export {
  validate as validateAsync,
  parse as parseAsync,
  safeParse as safeParseAsync,
  decode as decodeAsync,
  safeDecode as safeDecodeAsync,
  wrap as wrapAsync,
  WrappedAsyncSchema,
  pipe as pipeAsync,
  PipedAsyncSchema,
} from "./lib/async.ts";
