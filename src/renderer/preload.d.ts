import { ElectronHandler, ElectronAPIHandler } from '../main/preload';
import type { User, ContractRecord } from '../main/services/db';

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
        getContractRecords: () => Promise<{
          success: boolean;
          data?: ContractRecord[];
          error?: string;
        }>;
        searchContractRecords: (
          query: Partial<ContractRecord>,
        ) => Promise<{ success: boolean; data?: ContractRecord[]; error?: string }>;
        addContractRecord: (
          record: Omit<ContractRecord, 'id' | 'createTime' | 'updateTime'>,
        ) => Promise<{ success: boolean; data?: ContractRecord; error?: string }>;
        updateContractRecord: (
          id: number,
          recordData: Partial<ContractRecord>,
        ) => Promise<{ success: boolean; data?: ContractRecord; error?: string }>;
        deleteContractRecord: (
          id: number,
        ) => Promise<{ success: boolean; error?: string }>;
      };
    };
  }
}

export {};
