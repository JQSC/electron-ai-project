import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Popover, Space } from 'antd';
import { useState } from 'react';
import SettingDirModal from '@components/SettingDirModal';
import { TagType } from '../../../../../types/chat';
import styles from './index.module.less';

export default function ChatCommandTags() {
  const [overrideVisible, setOverrideVisible] = useState(false);
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
        setOverrideVisible(true);
        // tag.filePath = await window.electronAPI.openFile();
        // if (tag.filePath) {
        //   // 提取文件路径中的文件或文件夹名称
        //   tag.fileName = tag.filePath.split('/').pop() || tag.fileName;
        //   setTags([...tags, tag]);
        //   setContent('');
        // }
        break;
      case TagType.FILES:
        tag.filePath = await window.electronAPI.openFile();
        if (tag.filePath) {
          tag.fileName = tag.filePath.split('/').pop() || tag.fileName;
          setTags([...tags, tag]);
          // setContent('');
        }
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setOverrideVisible(false);
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
    setTags([...tags, tag]);
    // setContent('');
    setOverrideVisible(false);
  };

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

  const onMenuClick = (e) => {
    console.log('click', e);
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
      <Popover content={tagContent} title="Add Tag" trigger="hover">
        <Button type="text" icon={<PlusOutlined />} />
      </Popover>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Dropdown.Button
            menu={{ items: menuItems, onClick: onMenuClick }}
            key={tag.fileName}
          >
            {tag.fileName}
          </Dropdown.Button>
        ))}
      </div>
      <SettingDirModal
        visible={overrideVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
}
