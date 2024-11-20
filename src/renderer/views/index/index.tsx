import React, { useState } from 'react';
import { Layout, Form, Input, Select, Radio, Button, Space } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import './index.less';

const { TextArea } = Input;

const App: React.FC = () => {

  const [form] = Form.useForm();
  const [output, setOutput] = useState('');

  const onFinish = (values: any) => {
    setOutput(JSON.stringify(values, null, 2));
  };

  return (
    <div className="container">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="content">
          <div className="left-section">
            <TextArea
              rows={10}
              placeholder="Enter your text here"
              className="main-textarea"
            />
            <div className="config-section">
              <Form.Item label="目录或文件">
                <Radio.Group>
                  <Radio value="directory"><FolderOutlined /> 目录</Radio>
                  <Radio value="file"><FileOutlined /> 文件</Radio>
                </Radio.Group>
              </Form.Item>

              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Form.Item label="选择目录">
                  <Button>点击打开选择目录</Button>
                </Form.Item>

                <Form.Item label="token" name="token">
                  <Input placeholder="请输入token" />
                </Form.Item>

                <Form.Item label="model" name="model">
                  <Select placeholder="请选择model">
                    <Select.Option value="model1">Model 1</Select.Option>
                    <Select.Option value="model2">Model 2</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="exclude" name="exclude">
                  <Input placeholder="请输入exclude" />
                </Form.Item>

                <Form.Item label="FileExtensions" name="fileExtensions">
                  <Select placeholder="请选择文件扩展名">
                    <Select.Option value="txt">.txt</Select.Option>
                    <Select.Option value="md">.md</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="覆盖" name="override">
                  <Select placeholder="请选择覆盖选项">
                    <Select.Option value="yes">是</Select.Option>
                    <Select.Option value="no">否</Select.Option>
                  </Select>
                </Form.Item>
              </Space>
            </div>
          </div>

          <div className="right-section">
            <div className="output-display">
              <pre>{output}</pre>
            </div>
          </div>
        </div>

        <div className="footer">
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default App;
