/**
 * lowdb 数据库服务
 */
import { app } from 'electron';
import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';

// 定义数据结构
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  address: string;
  createTime: string;
}

// 定义数据库结构
interface Database {
  users: User[];
}

// 初始数据
const defaultData: Database = {
  users: [
    {
      id: 1,
      name: '张三',
      age: 25,
      email: 'zhangsan@example.com',
      address: '北京市朝阳区',
      createTime: new Date().toISOString(),
    },
    {
      id: 2,
      name: '李四',
      age: 30,
      email: 'lisi@example.com',
      address: '上海市浦东新区',
      createTime: new Date().toISOString(),
    },
    {
      id: 3,
      name: '王五',
      age: 28,
      email: 'wangwu@example.com',
      address: '广州市天河区',
      createTime: new Date().toISOString(),
    },
  ],
};

// 声明DBService类型，避免"使用前定义"的错误
class DBService {
  private db: Low<Database>;

  private static instance: DBService;

  private constructor() {
    // 确保数据目录存在
    const userDataPath = app.getPath('userData');
    console.log('userDataPath', userDataPath);
    const dbDir = join(userDataPath, 'db');

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const file = join(dbDir, 'db.json');
    const adapter = new JSONFile<Database>(file);
    this.db = new Low<Database>(adapter, defaultData);

    // 初始化数据库
    this.initDB();
  }

  /**
   * 获取单例实例
   * @returns DBService实例
   */
  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  /**
   * 初始化数据库
   */
  private async initDB(): Promise<void> {
    try {
      await this.db.read();
      // 如果数据为空，使用默认数据
      if (!this.db.data) {
        this.db.data = defaultData;
        await this.db.write();
      }
    } catch (error) {
      console.error('初始化数据库失败:', error);
      this.db.data = defaultData;
      await this.db.write();
    }
  }

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  public async getUsers(): Promise<User[]> {
    await this.db.read();
    return this.db.data?.users || [];
  }

  /**
   * 根据条件查询用户
   * @param query 查询条件
   * @returns 符合条件的用户列表
   */
  public async searchUsers(query: Partial<User>): Promise<User[]> {
    await this.db.read();
    const users = this.db.data?.users || [];

    return users.filter((user) => {
      return Object.entries(query).every(([key, value]) => {
        if (value === undefined || value === '') return true;

        const userValue = user[key as keyof User];

        if (typeof userValue === 'string' && typeof value === 'string') {
          return userValue.includes(value);
        }

        return userValue === value;
      });
    });
  }

  /**
   * 添加用户
   * @param user 用户信息
   * @returns 添加后的用户
   */
  public async addUser(user: Omit<User, 'id' | 'createTime'>): Promise<User> {
    await this.db.read();
    const users = this.db.data?.users || [];

    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      createTime: new Date().toISOString(),
    };

    users.push(newUser);
    await this.db.write();

    return newUser;
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param userData 更新的用户数据
   * @returns 更新后的用户
   */
  public async updateUser(
    id: number,
    userData: Partial<User>,
  ): Promise<User | null> {
    await this.db.read();
    const users = this.db.data?.users || [];

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...users[userIndex],
      ...userData,
    };

    users[userIndex] = updatedUser;
    await this.db.write();

    return updatedUser;
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 是否删除成功
   */
  public async deleteUser(id: number): Promise<boolean> {
    await this.db.read();
    const users = this.db.data?.users || [];

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    await this.db.write();

    return true;
  }
}

export default DBService.getInstance();
export type { User, Database };
