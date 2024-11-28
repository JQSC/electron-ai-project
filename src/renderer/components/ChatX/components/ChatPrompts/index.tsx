import { PromptProps, Prompts } from '@ant-design/x';
import { type GetProp } from 'antd';
import {
  BulbOutlined,
  FireOutlined,
  ReadOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { COMMENT_PROMPT, DEPENDENT_SORT_PROMPT } from '@constants/masks';

const ChatPrompts = ({ onChange }: { onChange: (data: any) => void }) => {
  const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      label: '增加注释',
      description: '批量为代码增加注释',
      icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    },
    {
      key: '2',
      label: '调整依赖顺序',
      description: '批量调整代码的依赖顺序',
      icon: <RocketOutlined style={{ color: '#722ED1' }} />,
    },
  ];

  const onPromptsItemClick = ({ data }: { data: PromptProps }) => {
    let prompt = '';
    if (data.key === '1') {
      prompt = COMMENT_PROMPT;
    } else if (data.key === '2') {
      prompt = DEPENDENT_SORT_PROMPT;
    }

    onChange({ ...data, prompt });
  };

  return (
    <Prompts
      title="🤔 选择提示词"
      items={senderPromptsItems}
      onItemClick={onPromptsItemClick}
      wrap
    />
  );
};

export default ChatPrompts;
