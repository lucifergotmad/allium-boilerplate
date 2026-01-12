export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ID = string;

export type Nullable<T> = T | null | undefined;
