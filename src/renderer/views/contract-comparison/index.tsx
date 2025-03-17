import React, { useState } from 'react';
import { Upload, Button, Row, Col, Card, Spin, message, Tabs } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ContractDiffViewer from './ContractDiffViewer';
import ModificationList from './ModificationList';
import './index.less';

const { Dragger } = Upload;
const { TabPane } = Tabs;

/**
 * 合同对比页面组件
 *
 * @returns {JSX.Element} 合同对比页面
 */
const ContractComparison: React.FC = () => {
  // 原始文档内容
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  // 修改后的文档内容
  const [modifiedContent, setModifiedContent] = useState<string | null>(null);
  // 修改点列表
  const [modifications, setModifications] = useState<any[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 当前步骤：1-上传文件，2-对比结果
  const [currentStep, setCurrentStep] = useState<number>(1);

  /**
   * 读取文件内容
   *
   * @param {any} file - 文件对象
   * @returns {Promise<string>} 文件内容
   */
  const readFileContent = (file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          resolve(e.target.result as string);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  /**
   * 发送文件内容到后端
   *
   * @param {string} content - 文件内容
   * @returns {Promise<any>} 后端响应
   */
  const sendToBackend = async (content: string): Promise<any> => {
    // 这里应该是实际的API调用
    // 为了演示，我们模拟一个响应
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟后端返回的数据
        resolve({
          content: `${content}\n\n这是修改后的内容示例`,
          modifications: [
            {
              id: 1,
              type: '新增',
              description: '添加了新条款',
              position: { line: 5, column: 10 },
            },
            {
              id: 2,
              type: '修改',
              description: '修改了甲方信息',
              position: { line: 2, column: 5 },
            },
            {
              id: 3,
              type: '删除',
              description: '删除了部分条款',
              position: { line: 8, column: 1 },
            },
          ],
        });
      }, 2000);
    });
  };

  /**
   * 处理文件上传
   *
   * @param {any} file - 上传的文件对象
   * @returns {boolean} 是否阻止默认上传行为
   */
  const handleFileUpload = async (file: any) => {
    setLoading(true);

    try {
      // 读取上传的文件内容
      const fileContent = await readFileContent(file);
      setOriginalContent(fileContent);

      // 调用后端接口获取修改后的文档内容
      const response = await sendToBackend(fileContent);
      setModifiedContent(response.content);
      setModifications(response.modifications);

      // 切换到对比结果步骤
      setCurrentStep(2);
      message.success('文档分析完成');
    } catch (error) {
      console.error('处理文件时出错:', error);
      message.error('处理文件时出错，请重试');
    } finally {
      setLoading(false);
    }

    // 阻止默认上传行为
    return false;
  };

  /**
   * 重新上传文件
   */
  const handleReupload = () => {
    setCurrentStep(1);
    setOriginalContent(null);
    setModifiedContent(null);
    setModifications([]);
  };

  /**
   * 渲染上传文件步骤
   *
   * @returns {JSX.Element} 上传文件界面
   */
  const renderUploadStep = () => (
    <Card className="upload-card">
      <Dragger
        name="file"
        multiple={false}
        beforeUpload={handleFileUpload}
        showUploadList={false}
        accept=".doc,.docx,.pdf,.txt"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持 .doc, .docx, .pdf, .txt 格式的合同文件
        </p>
      </Dragger>
    </Card>
  );

  /**
   * 渲染对比结果步骤
   *
   * @returns {JSX.Element} 对比结果界面
   */
  const renderComparisonStep = () => (
    <>
      <div className="comparison-header">
        <h2>合同对比结果</h2>
        <Button type="primary" onClick={handleReupload}>
          重新上传
        </Button>
      </div>
      <Row gutter={16} className="comparison-container">
        <Col span={18}>
          <ContractDiffViewer
            originalContent={originalContent || ''}
            modifiedContent={modifiedContent || ''}
            modifications={modifications}
          />
        </Col>
        <Col span={6}>
          <ModificationList modifications={modifications} />
        </Col>
      </Row>
    </>
  );

  return (
    <div className="contract-comparison-container">
      <Spin spinning={loading} tip="正在处理文档...">
        {currentStep === 1 ? renderUploadStep() : renderComparisonStep()}
      </Spin>
    </div>
  );
};

export default ContractComparison;
