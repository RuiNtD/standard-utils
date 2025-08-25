export {
  type Schema,
  SchemaError,
  getDotPath,
  formatError,
} from "./lib/helpers.ts";

export {
  validate,
  safeParse,
  parse,
  decode,
  wrap,
  is,
  assert,
  WrappedSyncSchema,
} from "./lib/sync.ts";

export {
  validate as validateAsync,
  safeParse as safeParseAsync,
  parse as parseAsync,
  decode as decodeAsync,
  wrap as wrapAsync,
  is as isAsync,
  assert as assertAsync,
  WrappedAsyncSchema,
} from "./lib/async.ts";
