import { SettingOutlined, LinkOutlined, CodeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './index.less';

export default function ModelInfo() {
  return (
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
  );
}
