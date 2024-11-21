import { HfInference } from '@huggingface/inference';
import { dialog } from 'electron';
import { HttpsProxyAgent } from 'https-proxy-agent';

const { HUGGINGFACE_API_KEY } = process.env;
if (!HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY environment variable is not set.');
}

const client = new HfInference(HUGGINGFACE_API_KEY);
// 根据传入的文本，调用大模型处理返回结果
export async function llmGenerate(options: {
  prompt: string;
  content: string;
  model: string;
}) {
  const { prompt, content, model } = options;

  console.log('-------', prompt, content, model);

  const stream = client.chatCompletionStream({
    model,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content },
    ],
    max_tokens: 5000,
    fetch_options: {
      agent:
        process.env.HTTP_PROXY || process.env.http_proxy
          ? new HttpsProxyAgent(
              process.env.HTTP_PROXY || process.env.http_proxy || '',
            )
          : undefined,
    },
  });

  let out = '';
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        out += newContent;
        console.log(newContent);
      }
    }
    return out;
  } catch (error) {
    dialog.showErrorBox('错误', `调用大模型失败: ${error}`);
    console.log(error);
    return '';
  }
}

export default { llmGenerate };
