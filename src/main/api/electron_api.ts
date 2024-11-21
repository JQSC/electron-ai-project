import { ipcMain, dialog } from 'electron';

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
  });
  if (!canceled) {
    return filePaths[0];
  }
  return '';
};

ipcMain.handle('dialog:openFile', handleFileOpen);
