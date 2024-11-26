import React, { useState } from 'react';
import {
  Layout,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Space,
  Tooltip,
  message,
  Tag,
} from 'antd';
import {
  InfoCircleOutlined,
  FileOutlined,
  FolderOutlined,
  YoutubeOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import ChatX from '@components/ChatX';
import { LLMGenerateOptions } from '../../../types/ipc';
import { COMMENT_PROMPT, DEPENDENCY_PROMPT } from '../../constants/masks';



const { TextArea } = Input;

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [overrideVisible, setOverrideVisible] = useState(false);
  const onFinish = async (values: any) => {
    const {
      prompt,
      model,
      sourcePath,
      targetPath,
      override,
      excludeDirs,
      includeExts,
    } = values;
    // 校验
    if (!sourcePath) {
      message.error('请选择路径');
      return;
    }

    setLoading(true);
    const content = await window.electronAPI.generate({
      prompt,
      model,
      sourcePath,
      targetPath,
      isOverride: override === '0',
      excludeDirs,
      includeExts,
    } as LLMGenerateOptions);

    setOutput(content);
    setLoading(false);
  };

  const selectDirectory = async () => {
    const path = await window.electronAPI.openFile();
    form.setFieldValue('sourcePath', path);
  };

  const selectOutputDirectory = async () => {
    const path = await window.electronAPI.openFile();
    form.setFieldValue('targetPath', path);
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (allValues.override === '1') {
      setOverrideVisible(true);
    } else {
      setOverrideVisible(false);
    }
  };

  const handleClickMask = (mask: string) => {
    form.setFieldValue('prompt', mask);
  };

  return (
    <div className="container">
      <ChatX />
    </div>
  );
};

export default App;
