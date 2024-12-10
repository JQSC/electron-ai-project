import { HfInference } from '@huggingface/inference';
import { dialog } from 'electron';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

const { HUGGINGFACE_API_KEY } = process.env;
if (!HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY environment variable is not set.');
}

const client = new HfInference(HUGGINGFACE_API_KEY);

// { role: 'system', content: prompt || '你是一个AI助手' },
// { role: 'user', content },

// 根据传入的文本，调用大模型处理返回结果
export async function llmGenerate(options: {
  messages: { role: string; content: string }[];
  model: string;
  onUpdate?: (content: string | undefined) => void;
  onSuccess?: (content: string | undefined) => void;
}) {
  const { messages, model } = options;

  const stream = client.chatCompletionStream(
    {
      model,
      messages,
      max_tokens: 5000,
      timeout: 10000,
    },
    {
      // @ts-ignore
      fetch: async (input: any, init?: any) => {
        const response = await fetch(input, {
          ...init,
          agent: new HttpsProxyAgent(
            process.env.HTTP_PROXY || process.env.http_proxy || '',
          ),
        });

        // 将 response 转换为 web 标准的 Response 对象
        // @ts-ignore
        const res = new Response(response.body, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
        return res;
      },
    },
  );

  // 流式输出

  let out = '';
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        options.onUpdate?.(newContent);
        out += newContent;
      }
    }
    options.onSuccess?.(out);
    return out;
  } catch (error) {
    dialog.showErrorBox('错误', `调用大模型失败: ${error}`);
    console.log(error);
    return '';
  }
}

export default { llmGenerate };
