import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { LLMGenerateOptions } from '../../../types/ipc';
import services from '../../services';
import optimizeCode from './optimizeCode';

const llmGenerate = async ({
  prompt,
  model,
  content,
}: {
  prompt: string;
  model: string;
  content: string;
}) => {
  const text = await services.llmGenerate({
    prompt,
    model,
    content,
  });
  return text;
};

const handleLLMGenerate = async (
  event: IpcMainInvokeEvent,
  options: LLMGenerateOptions,
) => {
  const { prompt, model, content, optimize } = options;
  if (optimize) {
    return optimizeCode(llmGenerate, options);
  }
  return llmGenerate({ prompt: prompt || '你是一个AI助手', model, content });
};

ipcMain.handle('llm:generate', handleLLMGenerate);
