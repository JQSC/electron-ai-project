import { ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import services from '../services';

const handleLLMGenerate = async (
  event: IpcMainInvokeEvent,
  options: {
    prompt: string;
    content: string;
    model: string;
  },
) => {
  const res = await services.llmGenerate(options);
  return res;
};

ipcMain.handle('llm:generate', handleLLMGenerate);
