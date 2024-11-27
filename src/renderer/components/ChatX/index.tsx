import React, { useEffect, useState } from 'react';

import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import { createStyles } from 'antd-style';

import { type GetProp } from 'antd';
import ChatWelcome from './components/ChatWelcome';
import ChatCommandTags from './components/ChatCommandTags';

// 添加模型列表
const modelOptions = [
  { value: 'Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B' },
  { value: 'CodeLlama-34b', label: 'Code Llama 34B' },
  { value: 'GPT-4', label: 'GPT-4' },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      height: 600px;
      border-radius: 8px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      flex: 1;
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,

    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});

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

  // 功能标签

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      // const res = await window.electronAPI.generate({
      //   model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      //   content: message,
      // });
      // onSuccess(res);
      onSuccess(`Mock success return. You said: ${message} `);
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
        {/* <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} /> */}
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          onChange={onChange}
          onSubmit={onSubmit}
          prefix={<ChatCommandTags />}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default Independent;
