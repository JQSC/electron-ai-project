import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { LLMGenerateOptions } from '../../../types/ipc';
import services from '../../services';
import optimizeCode from './optimizeCode';

const handleLLMGenerate = async (
  event: IpcMainInvokeEvent,
  options: LLMGenerateOptions,
) => {
  const { prompt, model, content, optimize } = options;
  // if (optimize) {
  //   return optimizeCode(llmGenerate, options);
  // }
  return services.llmGenerate({
    prompt: prompt || '你是一个AI助手',
    model,
    content,
    onUpdate: (content) => {
      event.sender.send('llmStreamOutput', content);
    },
    onSuccess: (content) => {
      event.sender.send('llmStreamEnd', content);
    },
  });
};

ipcMain.handle('llm:generate', handleLLMGenerate);
