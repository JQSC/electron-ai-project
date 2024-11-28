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
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
};

const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [content, setContent] = useState('');

  const [selectedModel, setSelectedModel] = useState(
    'Qwen2.5-Coder-32B-Instruct',
  );

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      const res = await window.electronAPI.generate({
        model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        content: message,
      });
      if (res) {
        onSuccess(res);
      } else {
        onError(new Error('生成失败'));
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
  });

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onChange = (nextContent: string) => {
    setContent(nextContent);
  };

  // ==================== Nodes ====================

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'local' : 'ai',
      content: message,
    }),
  );

  const handleTagsChange = (tags) => {
    console.log('tags', tags);
    setContent('');
  };

  const handlePromptsChange = (data: any) => {
    console.log('data', data);
    onRequest(data.prompt);
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
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default Independent;
