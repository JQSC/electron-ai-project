import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { LLMGenerateOptions } from '../../../types/ipc';
import services from '../../services';
import optimizeCode from './optimizeCode';

const handleLLMGenerate = async (
  event: IpcMainInvokeEvent,
  options: LLMGenerateOptions,
) => {
  const { messages, model, optimize } = options;
  // if (optimize) {
  //   return optimizeCode(llmGenerate, options);
  // }
  return services.llmGenerate({
    model,
    messages,
    onUpdate: (content) => {
      event.sender.send('llmStreamOutput', content);
    },
    onSuccess: (content) => {
      event.sender.send('llmStreamEnd', content);
    },
  });
};

ipcMain.handle('llm:generate', handleLLMGenerate);
