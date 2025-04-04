import React, { useEffect, useState } from 'react';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { Button, Popover, type GetProp, Typography, Space } from 'antd';
import { SmileOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import ChatCommandTags from '@components/ChatCommandTags';
import WelcomeCard from '@components/WelcomeCard';
import PromptList from '@components/PromptList';

import useStyle from './style';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  user: {
    placement: 'end',
    variant: 'shadow',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
  system: {
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
  role: string;
  content: string | string[];
};

const Chat: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [content, setContent] = useState('');

  const [prompt, setPrompt] = useState(null);

  // 对话上下文
  const [messages, setMessages] = useState<AgentMessage[]>([]);

  // 存储标签
  const [files, setFiles] = useState<any[]>([]);

  const [output, setOutput] = useState('');

  const [loading, setLoading] = useState(false);

  const [senderHeader, setSenderHeader] = React.useState(false);

  const [selectedModel, setSelectedModel] = useState(
    'Qwen2.5-Coder-32B-Instruct',
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    (message) => ({
      // loading: status === 'loading',
      ...message,
      ...roles[message.role],
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

  const request = (messages: AgentMessage[]) => {
    console.log('messages', messages);
    window.electronAPI.generate({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      messages,
    });
  };
  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if ((!nextContent && !files.length) || nextContent === ' ') return;
    setContent('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: nextContent }];

    request(newMessages);

    setMessages([...newMessages, { role: 'system', content: '思考中...' }]);
  };

  const onChange = (nextContent: string) => {
    setContent(nextContent);
  };

  // 增加标签
  const handleTagsChange = (tags: any) => {
    setFiles(tags);
    setContent(' ');
  };

  const handlePromptsChange = (data: any) => {
    onSubmit(data.prompt);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleSelectPrompt = (item: any) => {
    // 点击关闭Popover
    document.getElementById('select-scene')?.click();
    console.log('item', item);
    setPrompt(item);
    setSenderHeader(true);
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
        {!items.length && <WelcomeCard />}
        {/* 🌟 消息列表 */}
        <Bubble.List items={items} roles={roles} className={styles.messages} />
        {/* 🌟 提示词 */}
        {/* <ChatPrompts onChange={handlePromptsChange} /> */}
        <div className={styles.toolWrapper}>
          <Popover
            placement="topLeft"
            title="选择场景"
            trigger="click"
            content={<PromptList onSelect={handleSelectPrompt} />}
          >
            <Button id="select-scene">选择场景</Button>
          </Popover>

          <div className={styles.toolIcon} onClick={handleClear}>
            <DeleteOutlined />
          </div>
        </div>
        {/* 🌟 输入框 */}
        <Sender
          header={
            <Sender.Header
              open={senderHeader}
              title={
                <Space>
                  <Typography.Text type="secondary">
                    {prompt?.icon}
                    {`  ${prompt?.title}`}
                  </Typography.Text>
                </Space>
              }
              onOpenChange={setSenderHeader}
            />
          }
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

export default Chat;
