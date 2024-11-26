import fs from 'fs/promises';
import path from 'path';
import { LLMGenerateOptions } from '../../../types/ipc';

/**
 * 写入结果到文件
 * @param {string} content - 要写入的内容
 * @param {string} writePath - 写入文件的路径
 */
async function writeFile(content: string, writePath: string) {
  await fs.writeFile(writePath, content, 'utf8');
}

// 递归遍历目录
// @ts-ignore
async function walkDir(dir: string) {
  const results = [];
  const files = await fs.readdir(dir, { withFileTypes: true });

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      results.push(...(await walkDir(filePath)));
    } else {
      results.push(filePath);
    }
  }

  return results;
}

/**
 * 主运行函数
 * @param {string} sourcePath - 目录路径
 * @param {boolean} isWrite - 是否写入原文件
 * @param {string[]} includeDirs - 包含的文件后缀
 * @param {string[]} excludeDirs - 排除的目录
 */
async function optimizeCode(
  llmGenerate: (options: {
    prompt: string;
    model: string;
    content: string;
  }) => Promise<string>,
  options: LLMGenerateOptions,
) {
  const {
    prompt,
    model,
    sourcePath,
    targetPath,
    isOverride = true,
    includeExts = [],
    excludeDirs = [] as string[],
  } = options;
  try {
    if (!sourcePath) {
      throw new Error('sourcePath is required');
    }
    const stats = await fs.stat(sourcePath);

    // 判断是否是目录
    if (!stats.isDirectory()) {
      const content = await fs.readFile(sourcePath, 'utf8');
      const resContent = await llmGenerate({
        prompt: prompt || '你是一个AI助手',
        model,
        content,
      });
      const writePath = isOverride ? sourcePath : targetPath;
      await writeFile(resContent, writePath || '');
      return 'success';
    }

    // 遍历所有文件
    for await (const filePath of walkDir(sourcePath)) {
      // 检查是否在排除目录中
      // @ts-ignore
      if (excludeDirs.some((excluded: string) => filePath.includes(excluded))) {
        continue;
      }

      // 检查文件后缀名
      const fileExt = path.extname(filePath);
      if (includeExts.includes(fileExt)) {
        console.log(`Found file: ${filePath}`);

        try {
          const content = await fs.readFile(filePath, 'utf8');
          const resContent = await llmGenerate({
            prompt: prompt || '你是一个AI助手',
            model,
            content,
          });

          const writePath = isOverride ? filePath : targetPath;
          await writeFile(resContent, writePath);
          console.log('------');
        } catch (err) {
          console.error(`Error reading file ${filePath}: ${err}`);
        }
      }
    }
    return 'success';
  } catch (err) {
    console.error(`Error processing directory: ${err}`);
    return 'error';
  }
}

export default optimizeCode;
