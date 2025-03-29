import { ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import { fileProcessor } from '../services/fileProcessor';

/**
 * 打开文件对话框并返回所选文件路径
 */
const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: '文档文件', extensions: ['doc', 'docx', 'txt', 'pdf'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  });

  if (!canceled) {
    return filePaths[0];
  }
  return '';
};

/**
 * 读取文件内容
 * @param _event 事件对象
 * @param filePath 文件路径
 * @returns 文件内容
 */
const handleReadFile = async (_event: IpcMainInvokeEvent, filePath: string) => {
  try {
    return await fileProcessor.readFileContent(filePath);
  } catch (error) {
    console.error('读取文件时出错:', error);
    throw error;
  }
};

// 注册IPC处理程序
ipcMain.handle('dialog:openFile', handleFileOpen);
ipcMain.handle('file:readContent', handleReadFile);
