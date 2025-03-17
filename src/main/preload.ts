// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { LLMGenerateOptions } from '../types/ipc';
import type { User } from './services/db';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke(channel: string, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

const electronAPIHandler = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  generate: (options: LLMGenerateOptions) =>
    ipcRenderer.invoke('llm:generate', options),
  db: {
    getUsers: () => ipcRenderer.invoke('db:getUsers'),
    searchUsers: (query: Partial<User>) =>
      ipcRenderer.invoke('db:searchUsers', query),
    addUser: (user: Omit<User, 'id' | 'createTime'>) =>
      ipcRenderer.invoke('db:addUser', user),
    updateUser: (id: number, userData: Partial<User>) =>
      ipcRenderer.invoke('db:updateUser', { id, userData }),
    deleteUser: (id: number) => ipcRenderer.invoke('db:deleteUser', id),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('electronAPI', electronAPIHandler);

export type ElectronHandler = typeof electronHandler;
export type ElectronAPIHandler = typeof electronAPIHandler;
