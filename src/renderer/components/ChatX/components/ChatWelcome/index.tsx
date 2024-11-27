import { SettingOutlined, LinkOutlined, CodeOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Welcome } from '@ant-design/x';
import './index.less';

export default function ChatWelcome() {
  return (
    <Space direction="vertical" size={16} style={{ flex: 1, paddingTop: 32 }}>
      <Welcome
        variant="borderless"
        // icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="AI 工具集"
        description="自然语言生成、批量修改项目源码"
      />
      <div className="model-info">
        <div className="model-header">
          <h2>Current Model</h2>
          <Button
            type="text"
            icon={<SettingOutlined className="settings-icon" />}
            aria-label="Settings"
          />
        </div>
        <div className="model-name">
          <div className="model-icon">
            <img
              src="/placeholder.svg?height=24&width=24"
              alt=""
              className="w-6 h-6"
            />
          </div>
          <span>Qwen/Qwen2.5-72B-Instruct</span>
        </div>

        <div className="model-links">
          <a href="#" className="link">
            <LinkOutlined />
            <span>Model page</span>
          </a>
          <a href="#" className="link">
            <CodeOutlined />
            <span>API</span>
          </a>
          <a href="#" className="link">
            <LinkOutlined />
            <span>Website</span>
          </a>
        </div>
      </div>
    </Space>
  );
}
