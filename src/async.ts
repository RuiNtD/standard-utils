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
  WrappedAsyncSchema,
} from "./lib/async.ts";

export {
  validate as validateSync,
  safeParse as safeParseSync,
  parse as parseSync,
  decode as decodeSync,
  wrap as wrapSync,
  is as isSync,
  assert as assertSync,
  WrappedSyncSchema,
} from "./lib/sync.ts";
