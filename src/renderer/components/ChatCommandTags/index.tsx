import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Popover, Space } from 'antd';
import { useState } from 'react';
import SettingDirModal from '@components/SettingDirModal';
import { TagType } from '../../../types/chat';
import styles from './index.module.less';

const tools = [
  {
    key: '1',
    label: '增加注释',
  },
  {
    key: '2',
    label: '调整依赖顺序',
  },
];

const menuItems = [
  {
    key: '1',
    label: '编辑',
  },
  {
    key: '2',
    label: '删除',
  },
];

export default function ChatCommandTags({ onChange }) {
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState<
    { type: TagType; fileName: string; filePath: string }[]
  >([]);

  const handleAddTag = async (tagName: TagType) => {
    const tag = {
      type: tagName,
      fileName: 'default',
      filePath: '',
    };
    switch (tagName) {
      // 打开配置弹窗
      case TagType.FOLDERS:
        setVisible(true);
        break;
      case TagType.FILES:
        tag.filePath = await window.electronAPI.openFile();
        if (tag.filePath) {
          tag.fileName = tag.filePath.split('/').pop() || tag.fileName;
          const newTags = [...tags, tag];
          setTags(newTags);
          onChange(newTags);
        }
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = (values: any) => {
    const { sourcePath, override, excludeDirs, includeExts } = values;
    if (!sourcePath) {
      message.error('请选择目录');
      return;
    }
    const tag = {
      type: TagType.FOLDERS,
      fileName: sourcePath.split('/').pop() || 'default',
      filePath: sourcePath,
      config: {
        override: override === '0',
        excludeDirs: excludeDirs || [],
        includeExts: includeExts || [],
      },
    };
    const newTags = [...tags, tag];
    setTags(newTags);
    onChange(newTags);
    setVisible(false);
  };

  const onMenuClick = (e, tagIndex) => {
    const deleteTag = () => {
      const newTags = tags.filter((_, index) => index !== tagIndex);
      setTags(newTags);
      onChange(newTags);
    };

    switch (e.key) {
      case '1':
        deleteTag();
        handleAddTag(tags[tagIndex].type);
        break;
      case '2':
        deleteTag();
        break;
      default:
        break;
    }
  };

  const tagContent = (
    <Space>
      <Button onClick={() => handleAddTag(TagType.FOLDERS)}>
        {TagType.FOLDERS}
      </Button>
      <Button onClick={() => handleAddTag(TagType.FILES)}>
        {TagType.FILES}
      </Button>
    </Space>
  );

  return (
    <div className={styles.tagWrapper}>
      <Popover content={tagContent} title="工具列表" trigger="hover">
        <Button type="text" icon={<PlusOutlined />} />
      </Popover>
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <Dropdown.Button
              menu={{ items: menuItems, onClick: (e) => onMenuClick(e, index) }}
              key={index}
            >
              {tag.fileName}
            </Dropdown.Button>
          ))}
        </div>
      )}
      <SettingDirModal
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
}
