import React, { useEffect, useState } from 'react';

import {
  Attachments,
  Bubble,
  Conversations,
  PromptProps,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';

import { type GetProp } from 'antd';

import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import ChatWelcome from './components/ChatWelcome';
import ChatCommandTags from './components/ChatCommandTags';
import ChatPrompts from './components/ChatPrompts';
import useStyle from './style';

// 添加模型列表
const modelOptions = [
  { value: 'Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B' },
  { value: 'CodeLlama-34b', label: 'Code Llama 34B' },
  { value: 'GPT-4', label: 'GPT-4' },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    variant: 'shadow',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (content) => {
      return (
        <Prompts
          vertical
          items={(content as any as string[]).map((text) => ({
            key: text,
            icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
            description: text,
          }))}
        />
      );
    },
  },
};

type AgentMessage = {
  type: string;
  content: string | string[];
};

const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [content, setContent] = useState('');

  const [messages, setMessages] = useState<AgentMessage[]>([]);

  const [output, setOutput] = useState('');

  const [loading, setLoading] = useState(false);

  const [selectedModel, setSelectedModel] = useState(
    'Qwen2.5-Coder-32B-Instruct',
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    (message) => ({
      // loading: status === 'loading',
      ...message,
      ...roles[message.type],
    }),
  );

  useEffect(() => {
    window.electron.ipcRenderer.on('llmStreamOutput', (content) => {
      const msg = output + content;
      setOutput(msg);

      messages[messages.length - 1].content = msg;

      setMessages(messages);
    });

    window.electron.ipcRenderer.on('llmStreamEnd', (content) => {
      setOutput('');

      messages[messages.length - 1].content = content as string;
      setMessages(messages);
      setLoading(false);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('llmStreamOutput');
      window.electron.ipcRenderer.removeAllListeners('llmStreamEnd');
    };
  }, [messages, output]);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    setContent('');
    setLoading(true);
    setMessages([
      ...messages,
      { type: 'user', content: nextContent },
      { type: 'ai', content: '思考中...' },
    ]);
    window.electronAPI.generate({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      content: nextContent,
    });
  };

  const onChange = (nextContent: string) => {
    setContent(nextContent);
  };

  const handleTagsChange = (tags) => {
    console.log('tags', tags);
    setContent('');
  };

  const handlePromptsChange = (data: any) => {
    window.electronAPI.generate({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      content: data.prompt,
    });
  };

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      {/* 🌟 模型选择器 */}
      {/* <Select
        style={{ width: 200, marginBottom: 16 }}
        // value={selectedModel}
        onChange={setSelectedModel}
        options={modelOptions}
        placeholder="选择模型"
      /> */}
      <div className={styles.chat}>
        {/* 🌟 欢迎占位 */}
        {!items.length && <ChatWelcome />}
        {/* 🌟 消息列表 */}
        <Bubble.List items={items} roles={roles} className={styles.messages} />
        {/* 🌟 提示词 */}
        <ChatPrompts onChange={handlePromptsChange} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          onChange={onChange}
          onSubmit={onSubmit}
          prefix={<ChatCommandTags onChange={handleTagsChange} />}
          loading={loading}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default Independent;
