import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  message,
  Space,
  Button,
  Select,
  Radio,
} from 'antd';
import './index.less';

interface SettingDirModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const SettingDirModal: React.FC<SettingDirModalProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
        // form.resetFields();
        return values;
      })
      .catch((error) => {
        message.error('验证失败，请检查输入');
      });
  };

  const selectDirectory = async () => {
    const path = await window.electronAPI.openFile();
    form.setFieldValue('sourcePath', path);
  };

  const onFinish = async (values: any) => {
    const { sourcePath, override, excludeDirs, includeExts } = values;
    // 校验
    if (!sourcePath) {
      message.error('请选择路径');
    }
  };

  return (
    <Modal
      title="设置目录"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      className="setting-dir-modal"
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        initialValues={{
          sourcePath: '',
          override: '0',
          includeExts: ['tsx', 'jsx'],
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Form.Item label="选择目录或文件">
            <Button onClick={selectDirectory}>点击打开选择目录</Button>
          </Form.Item>
          <Form.Item label="路径" name="sourcePath" required>
            <Input placeholder="选择或手动输入路径" />
          </Form.Item>

          <Form.Item label="排除目录" name="excludeDirs">
            <Input placeholder="请输入要排除的目录名称" />
          </Form.Item>

          <Form.Item label="文件后缀" name="includeExts">
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
        </Space>
      </Form>
    </Modal>
  );
};

export default SettingDirModal;
