/**
 * 数据库 IPC 通信接口
 */
import { ipcMain } from 'electron';
import { dbService } from '../services';
import type { User, ContractRecord } from '../services/db';

// 获取所有用户
ipcMain.handle('db:getUsers', async () => {
  try {
    const users = await dbService.getUsers();
    return { success: true, data: users };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return { success: false, error: '获取用户列表失败' };
  }
});

// 搜索用户
ipcMain.handle('db:searchUsers', async (_, query: Partial<User>) => {
  try {
    const users = await dbService.searchUsers(query);
    return { success: true, data: users };
  } catch (error) {
    console.error('搜索用户失败:', error);
    return { success: false, error: '搜索用户失败' };
  }
});

// 添加用户
ipcMain.handle(
  'db:addUser',
  async (_, user: Omit<User, 'id' | 'createTime'>) => {
    try {
      const newUser = await dbService.addUser(user);
      return { success: true, data: newUser };
    } catch (error) {
      console.error('添加用户失败:', error);
      return { success: false, error: '添加用户失败' };
    }
  },
);

// 更新用户
ipcMain.handle(
  'db:updateUser',
  async (_, { id, userData }: { id: number; userData: Partial<User> }) => {
    try {
      const updatedUser = await dbService.updateUser(id, userData);
      if (!updatedUser) {
        return { success: false, error: '用户不存在' };
      }
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('更新用户失败:', error);
      return { success: false, error: '更新用户失败' };
    }
  },
);

// 删除用户
ipcMain.handle('db:deleteUser', async (_, id: number) => {
  try {
    const success = await dbService.deleteUser(id);
    if (!success) {
      return { success: false, error: '用户不存在' };
    }
    return { success: true };
  } catch (error) {
    console.error('删除用户失败:', error);
    return { success: false, error: '删除用户失败' };
  }
});

// 获取所有合同记录
ipcMain.handle('db:getContractRecords', async () => {
  try {
    const records = await dbService.getContractRecords();
    return { success: true, data: records };
  } catch (error) {
    console.error('获取合同记录列表失败:', error);
    return { success: false, error: '获取合同记录列表失败' };
  }
});

// 搜索合同记录
ipcMain.handle(
  'db:searchContractRecords',
  async (_, query: Partial<ContractRecord>) => {
    try {
      const records = await dbService.searchContractRecords(query);
      return { success: true, data: records };
    } catch (error) {
      console.error('搜索合同记录失败:', error);
      return { success: false, error: '搜索合同记录失败' };
    }
  },
);

// 添加合同记录
ipcMain.handle(
  'db:addContractRecord',
  async (
    _,
    record: Omit<ContractRecord, 'id' | 'createTime' | 'updateTime'>,
  ) => {
    try {
      const newRecord = await dbService.addContractRecord(record);
      return { success: true, data: newRecord };
    } catch (error) {
      console.error('添加合同记录失败:', error);
      return { success: false, error: '添加合同记录失败' };
    }
  },
);

// 更新合同记录
ipcMain.handle(
  'db:updateContractRecord',
  async (_, { id, recordData }: { id: number; recordData: Partial<ContractRecord> }) => {
    try {
      const updatedRecord = await dbService.updateContractRecord(id, recordData);
      if (!updatedRecord) {
        return { success: false, error: '合同记录不存在' };
      }
      return { success: true, data: updatedRecord };
    } catch (error) {
      console.error('更新合同记录失败:', error);
      return { success: false, error: '更新合同记录失败' };
    }
  },
);

// 删除合同记录
ipcMain.handle('db:deleteContractRecord', async (_, id: number) => {
  try {
    const success = await dbService.deleteContractRecord(id);
    if (!success) {
      return { success: false, error: '合同记录不存在' };
    }
    return { success: true };
  } catch (error) {
    console.error('删除合同记录失败:', error);
    return { success: false, error: '删除合同记录失败' };
  }
});
