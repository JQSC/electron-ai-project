import { ipcMain } from 'electron';
import compileService, { CompileService } from '../services/compile';

/**
 * 初始化编译相关的IPC处理程序
 */
const initCompileApi = () => {
  /**
   * 获取编译数据
   */
  ipcMain.handle('compile:getData', async () => {
    try {
      const result = await CompileService.getCompileData();
      return result;
    } catch (error) {
      console.error('获取编译数据失败:', error);
      return {
        status: 'error',
        message: '获取编译数据失败',
        data: null,
        errorCode: 1,
      };
    }
  });
};

initCompileApi();
