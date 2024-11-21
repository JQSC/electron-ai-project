import { ElectronHandler, ElectronAPIHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronAPI: ElectronAPIHandler;
  }
}

export {};
