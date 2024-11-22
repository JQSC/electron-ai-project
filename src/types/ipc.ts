export interface LLMGenerateOptions {
  prompt: string;
  model: string;
  sourcePath: string;
  targetPath?: string;
  isOverride: boolean;
  exclude: string;
  fileExtensions: string[];
  [key: string]: any;
}
