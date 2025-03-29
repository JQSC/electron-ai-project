import fs from 'fs';
import path from 'path';
import * as mammoth from 'mammoth';

/**
 * 处理不同格式的文件，提取文本内容
 */
export const fileProcessor = {
  /**
   * 读取文本文件内容
   * @param filePath 文件路径
   * @returns 文件内容
   */
  readTextFile: async (filePath: string): Promise<string> => {
    return fs.promises.readFile(filePath, 'utf-8');
  },

  /**
   * 读取Word文档内容(.doc, .docx)
   * @param filePath 文件路径
   * @returns 文档内容文本
   */
  readWordDocument: async (filePath: string): Promise<string> => {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value; // 提取的文本内容
    } catch (error: any) {
      console.error('读取Word文档时出错:', error);
      throw new Error(`读取Word文档失败: ${error.message || '未知错误'}`);
    }
  },

  /**
   * 根据文件扩展名读取内容
   * @param filePath 文件路径
   * @returns 文件内容文本
   */
  readFileContent: async (filePath: string): Promise<string> => {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.txt':
        return fileProcessor.readTextFile(filePath);
      case '.doc':
      case '.docx':
        return fileProcessor.readWordDocument(filePath);
      default:
        throw new Error(`不支持的文件类型: ${ext}`);
    }
  },
};
