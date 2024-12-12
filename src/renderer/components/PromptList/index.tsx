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
import './index.less';

const scenes = [
  {
    icon: <BulbOutlined className="scene-icon bulb" />,
    title: '每日工作总结',
    description: '一键生成工作总结，查看项目关键进展和待办事项',
  },
  {
    icon: <SearchOutlined className="scene-icon search" />,
    title: '企业搜一搜',
    description: '帮助你搜索企业内的信息或回答相关问题',
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
    icon: <PlaySquareOutlined className="scene-icon video" />,
    title: '短视频脚本',
    description: '为你创作出引人入胜的短视频脚本',
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

const SceneList: React.FC = () => {
  return (
    <Scrollbars style={{ width: 500, height: 300 }}>
      <List
        className="scene-list"
        itemLayout="horizontal"
        dataSource={scenes}
        renderItem={(item) => (
          <List.Item className="scene-item">
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
