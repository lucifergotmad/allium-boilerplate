export interface SerializedException {
  message: string;
  code: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}
