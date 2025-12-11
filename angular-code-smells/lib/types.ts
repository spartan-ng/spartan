export type TSXFile = {
  path: string;
  content: string;
}

export type SourceLocation = {
  start?: number;
  end?: number;
  path?: string;
}