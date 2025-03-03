import { ElectronHandler, ElectronAPIHandler } from '../main/preload';
import type { User } from '../main/services/db';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronAPI: ElectronAPIHandler & {
      db: {
        getUsers: () => Promise<{
          success: boolean;
          data?: User[];
          error?: string;
        }>;
        searchUsers: (
          query: Partial<User>,
        ) => Promise<{ success: boolean; data?: User[]; error?: string }>;
        addUser: (
          user: Omit<User, 'id' | 'createTime'>,
        ) => Promise<{ success: boolean; data?: User; error?: string }>;
        updateUser: (
          id: number,
          userData: Partial<User>,
        ) => Promise<{ success: boolean; data?: User; error?: string }>;
        deleteUser: (
          id: number,
        ) => Promise<{ success: boolean; error?: string }>;
      };
    };
  }
}

export {};
