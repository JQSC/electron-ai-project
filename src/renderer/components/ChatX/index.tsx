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
    request: async ({ message }, { onSuccess, onUpdate, onError }) => {
      // const res = await window.electronAPI.generate({
      //   model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      //   content: message,
      // });

      onUpdate({
        list: [{ type: 'ai', content: '生成中...' }],
      });
      setTimeout(() => {
        onUpdate({
          list: [{ type: 'suggestion', content: ['1111', '2222'] }],
        });
      }, 1000);

      setTimeout(() => {
        onSuccess({
          list: [
            { type: 'ai', content: res },
            { type: 'suggestion', content: ['1111', '2222'] },
          ],
        });
      }, 2000);
      const res = '生成成功';
      if (res) {
      } else {
        onError(new Error('生成失败'));
      }
    },
  });

  const { onRequest, messages, parsedMessages } = useXChat({
    agent,
    parser: (agentMessages) => {
      console.log('agentMessages', agentMessages);

      const list = agentMessages.content
        ? [agentMessages]
        : (agentMessages as any).list;

      return (list || []).map((msg) => ({
        role: msg.type,
        content: msg.content,
      }));
    },
  });

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest({
      type: 'user',
      content: nextContent,
    });
    setContent('');
  };

  const onChange = (nextContent: string) => {
    setContent(nextContent);
  };

  // ==================== Nodes ====================

  const items: GetProp<typeof Bubble.List, 'items'> = parsedMessages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      ...message,
    }),
  );

  const handleTagsChange = (tags) => {
    console.log('tags', tags);
    setContent('');
  };

  const handlePromptsChange = (data: any) => {
    console.log('messages', messages);
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
