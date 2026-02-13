import type { StandardSchemaV1 as S } from "./common.ts";
import type { WrappedAsyncSchema } from "./async.ts";
import type { WrappedSyncSchema } from "./sync.ts";

export type { WrappedAsyncSchema, WrappedSyncSchema };
export type WrappedSchema<Schema extends S = S> =
  | WrappedAsyncSchema<Schema>
  | WrappedSyncSchema<Schema>;

/** Infers the input type of a Standard Schema or a wrapped Standard Schema. */
export type InferInput<Schema extends S | { schema: S }> = Schema extends S
  ? S.InferInput<Schema>
  : Schema extends { schema: S }
    ? S.InferInput<Schema["schema"]>
    : never;

/** Infers the output type of a Standard Schema or a wrapped Standard Schema. */
export type InferOutput<Schema extends S | { schema: S }> = Schema extends S
  ? S.InferOutput<Schema>
  : Schema extends { schema: S }
    ? S.InferOutput<Schema["schema"]>
    : never;
