import fs from 'fs';
import path from 'path';
import { app } from 'electron';

/**
 * 编译数据服务
 */
export class CompileService {
  /**
   * 获取编译数据
   * @returns {Promise<any>} 编译数据
   */
  static async getCompileData(): Promise<any> {
    try {
      // 读取本地JSON文件
      // const filePath = path.join(
      //   app.getAppPath(),
      //   'src',
      //   'renderer',
      //   'views',
      //   'compile',
      //   'data.json',
      // );
      // const data = fs.readFileSync(filePath, 'utf-8');
      // const result = JSON.parse(data);

      const response = await fetch(
        `${process.env.CANGQIONG_URL}/api/task/longTime?pageSize=15&curPage=1&type=0&projectName=fe-c-pc`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'x-requested-with': 'XMLHttpRequest',
            'x-xsrf-token': 'oHpBVmX4QMKWBKwMAkwTIw',
          },
          referrer: `${process.env.CANGQIONG_URL}/next/tasks`,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        },
      );

      const result = await response.json();

      // 过滤掉状态为失败(status=3)或没有时间线记录的数据
      if (
        result.status === 'success' &&
        result.data &&
        Array.isArray(result.data.dataList)
      ) {
        result.data.dataList = result.data.dataList.filter(
          (item: any) =>
            item.status !== 3 && item.timeline && item.timeline.length >= 1,
        );
      }

      return result;
    } catch (error) {
      console.error('读取编译数据失败:', error);
      return {
        status: 'error',
        message: '读取编译数据失败',
        data: null,
        errorCode: 1,
      };
    }
  }
}

export default new CompileService();
