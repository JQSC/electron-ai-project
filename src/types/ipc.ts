export interface LLMGenerateOptions {
  /** 提供给 LLM 的提示文本 */
  prompt: string;

  /** 要使用的 LLM 模型名称 */
  model: string;

  /** 源代码路径 */
  sourcePath: string;

  /** 可选的目标输出路径 */
  targetPath?: string;

  /** 是否覆盖现有文件 */
  isOverride: boolean;

  /** 要排除的文件或目录模式 */
  excludeDirs: string;

  /** 要处理的文件扩展名列表 */
  includeExts: string[];

  /** 允许添加其他任意属性 */
  [key: string]: any;
}
