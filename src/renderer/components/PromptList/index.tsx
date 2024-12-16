import React from 'react';
import { List } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  BulbOutlined,
  SearchOutlined,
  FilePdfOutlined,
  TableOutlined,
  AppstoreOutlined,
  TeamOutlined,
  PlaySquareOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { COMMENT_PROMPT, DEPENDENT_SORT_PROMPT } from '@constants/prompts';
import './index.less';

const scenes = [
  {
    icon: <BulbOutlined className="scene-icon bulb" />,
    title: '代码注释生成',
    description: '一键生成代码注释，提高代码可读性',
    prompt: COMMENT_PROMPT,
  },
  {
    icon: <SearchOutlined className="scene-icon search" />,
    title: '调整代码依赖顺序',
    description: '一键调整代码依赖顺序，提高代码可读性',
    prompt: DEPENDENT_SORT_PROMPT,
  },
  {
    icon: <FilePdfOutlined className="scene-icon pdf" />,
    title: 'PDF 问答',
    description: '高效而深入地阅读 PDF',
  },
  {
    icon: <TableOutlined className="scene-icon table" />,
    title: '表格公式生成',
    description: '精通表格公式，可以帮你写公式、解读公式',
  },
  {
    icon: <AppstoreOutlined className="scene-icon matrix" />,
    title: '多维表格系统搭建',
    description: '使用多维表格帮你搭建业务应用、或将内容结构化',
  },
  {
    icon: <TeamOutlined className="scene-icon team" />,
    title: '朋友圈文案大师',
    description: '精通各种风格的朋友圈文案创作',
  },
  {
    icon: <BarChartOutlined className="scene-icon chart" />,
    title: '新年规划助手',
    description: '帮助制定完整的新年计划和目标',
  },
  {
    icon: <SettingOutlined className="scene-icon setting" />,
    title: '管理和创建新场景',
    description: '自定义和管理你的专属场景',
  },
];

const SceneList: React.FC<{ onSelect: (item: any) => void }> = ({
  onSelect,
}) => {
  const handleSelectPrompt = (item: any) => {
    onSelect(item);
  };

  return (
    <Scrollbars style={{ width: 500, height: 300 }}>
      <List
        className="scene-list"
        itemLayout="horizontal"
        dataSource={scenes}
        renderItem={(item) => (
          <List.Item
            className="scene-item"
            onClick={() => handleSelectPrompt(item)}
          >
            <List.Item.Meta
              avatar={item.icon}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Scrollbars>
  );
};

export default SceneList;
