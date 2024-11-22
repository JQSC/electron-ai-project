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
} from 'antd';
import {
  InfoCircleOutlined,
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { LLMGenerateOptions } from '../../../types/ipc';
import './index.less';

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
      exclude,
      fileExtensions,
    } = values;
    // 校验
    if (!sourcePath) {
      message.error('请选择路径');
      return;
    }
    // setOutput(JSON.stringify(values, null, 2));

    console.log('sourcePath', sourcePath);
    setLoading(true);
    const content = await window.electronAPI.generate({
      prompt,
      model,
      sourcePath,
      targetPath,
      isOverride: override === '0',
      exclude,
      fileExtensions,
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

  return (
    <div className="container">
      <Form
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        layout="inline"
        initialValues={{
          prompt: '增加注释',
          sourcePath: '/Users/liepin/my/electron-ai-project/test/simple.tsx',
          apiKey: 'HUGGINGFACE_API_KEY',
          model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
          override: '0',
          fileExtensions: ['tsx', 'jsx'],
        }}
      >
        <div className="content">
          <div className="section">
            <div className="main-textarea-wrapper">
              <Form.Item name="prompt" style={{ marginRight: 0 }}>
                <TextArea
                  rows={10}
                  placeholder="请输入prompt"
                  className="main-textarea"
                />
              </Form.Item>

              <div className="bottom-section">
                <div className="output-display">
                  <pre>{output}</pre>
                </div>
              </div>
            </div>
            <div className="config-section">
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                <Form.Item label="选择目录或文件">
                  <Button onClick={selectDirectory}>点击打开选择目录</Button>
                </Form.Item>
                <Form.Item label="路径" name="sourcePath">
                  <Input placeholder="选择或手动输入路径" />
                </Form.Item>

                <Form.Item label="模型" name="model">
                  <Select placeholder="请选择model">
                    <Select.Option value="Qwen/Qwen2.5-Coder-32B-Instruct">
                      Qwen/Qwen2.5-Coder-32B-Instruct
                    </Select.Option>
                    <Select.Option value="llama3B">llama3B</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="api_key" name="apiKey">
                  <Radio.Group>
                    <Radio value="HUGGINGFACE_API_KEY">
                      环境变量
                      <Tooltip
                        placement="top"
                        title="环境变量：HUGGINGFACE_API_KEY"
                      >
                        <span style={{ marginLeft: 4 }}>
                          <InfoCircleOutlined />
                        </span>
                      </Tooltip>
                    </Radio>
                    <Radio value="custom">自定义</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="排除目录" name="exclude">
                  <Input placeholder="请输入要排除的目录名称" />
                </Form.Item>

                <Form.Item label="文件后缀" name="fileExtensions">
                  <Select
                    mode="multiple"
                    placeholder="请选择文件扩展名"
                    defaultValue={['txt']}
                  >
                    <Select.Option value="ts">.ts</Select.Option>
                    <Select.Option value="tsx">.tsx</Select.Option>
                    <Select.Option value="jsx">.jsx</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="覆盖原文件" name="override">
                  <Radio.Group>
                    <Radio value="0">是</Radio>
                    <Radio value="1">否</Radio>
                  </Radio.Group>
                </Form.Item>
                {overrideVisible ? (
                  <>
                    <Form.Item label="选择目录或文件">
                      <Button onClick={selectOutputDirectory}>
                        点击打开选择目录
                      </Button>
                    </Form.Item>
                    <Form.Item label="路径" name="targetPath">
                      <Input placeholder="选择或手动输入路径" />
                    </Form.Item>
                  </>
                ) : null}
              </Space>
            </div>
          </div>

          <div className="footer">
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                提交
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default App;
