const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

const { HUGGINGFACE_API_KEY } = process.env;
if (!HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY environment variable is not set.');
}
export async function requestGenerate(options: {
  prompt: string;
  content: string;
  model: string;
}) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct',
    {
      agent: proxyAgent, // 将代理代理对象传递给 fetch
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: options.prompt,
    },
  );
  const result = await response.json();
  return result;
}

export default { requestGenerate };
