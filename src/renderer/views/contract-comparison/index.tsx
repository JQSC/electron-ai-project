import React, { useState } from 'react';
import { Upload, Button, Row, Col, Card, Spin, message, Tabs } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as Diff from 'diff';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import ContractDiffViewer from './ContractDiffViewer';
import ModificationList from './ModificationList';
import './index.less';

const { Dragger } = Upload;
const { TabPane } = Tabs;

interface Position {
  line: number;
  column: number;
}

interface Modification {
  id: number;
  type: string;
  description: string;
  position: Position;
}

/**
 * 合同对比页面组件
 *
 * @returns {React.ReactElement} 合同对比页面
 */
const ContractComparison: React.FC = () => {
  // 原始文档内容
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  // 修改后的文档内容
  const [modifiedContent, setModifiedContent] = useState<string | null>(null);
  // 修改点列表
  const [modifications, setModifications] = useState<Modification[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 当前步骤：1-上传文件，2-对比结果
  const [currentStep, setCurrentStep] = useState<number>(1);

  /**
   * 模拟修改后的内容
   *
   * @param {string} originalContent - 原始内容
   * @returns {string} 修改后的内容
   */
  const simulateModifiedContent = (originalContent: string): string => {
    // 使用图片中的示例数据
    return `保密协议
甲方(企业):法狗狗科技有限公司
乙方(员工):王婧
鉴于乙方在甲方任职工作,并获得甲方支付的劳务报酬,双方当事人就乙方在任职期间
及离职以后保守甲方商业秘密的事项,订定下列条款共同遵守:
第1条权属
双方确认,乙方在甲方工作任职期间,因履行职务或者主要是利用甲方的物质技术条
件、业务信息等产生的发明创造,技术秘密或其他商业秘密,有关的知识产权均属于甲方
享有,甲方可以在其业务范围内充分地利用这些发明创造、技术秘密或其他商业秘密,进
行生产,经营或者向第三方转让,乙方应当依甲方的要求,提供一切必要要的信息和采取
切必要的行动,包括申请、注册、登记等,协助甲方取得和行使有关的知识产权。
上述发明创造、技术秘密及其他商业有关的发明权、署名权(依照法律 规定应由甲方
著名的除外)等精神权利作为发明人、创作人或开发者的乙方享有,甲方尊重乙方的精神权
利并协助乙方行使这些权利,
第2条技术成果
乙方在甲方任职期间所完成的、与甲方业务相关的发明创造、技术秘密或其他商业秘
密,乙方主张由其本人享有知识产权的,应当及时向甲方中明。经甲方核实,认为确属于非
职务成果的,由乙方享有知识产权,甲方不得在未经乙方明确授权的前提下利用这些成果
进行生产 杨薄 六不得自行向第三六转让`;
  };

  /**
   * 从差异结果中提取修改点
   *
   * @param {Diff.Change[]} diffResult - 差异结果
   * @returns {Modification[]} 修改点列表
   */
  const extractModifications = (diffResult: Diff.Change[]): Modification[] => {
    const modifications: Modification[] = [];
    let lineIndex = 0;
    let modificationId = 1;

    diffResult.forEach((part) => {
      const lines = part.value.split('\n');
      // 移除最后一个空行（如果存在）
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      if (part.added) {
        // 新增内容
        lines.forEach((line: string, index: number) => {
          modifications.push({
            id: modificationId,
            type: '新增',
            description: `新增内容: ${line.substring(0, 30)}${line.length > 30 ? '...' : ''}`,
            position: { line: lineIndex + index + 1, column: 1 },
          });
          modificationId += 1;
        });
      } else if (part.removed) {
        // 删除内容
        lines.forEach((line: string, index: number) => {
          modifications.push({
            id: modificationId,
            type: '删除',
            description: `删除内容: ${line.substring(0, 30)}${line.length > 30 ? '...' : ''}`,
            position: { line: lineIndex + index + 1, column: 1 },
          });
          modificationId += 1;
        });
      }

      if (!part.added && !part.removed) {
        lineIndex += lines.length;
      }
    });

    return modifications;
  };

  /**
   * 读取文件内容
   *
   * @param {File} file - 文件对象
   * @returns {Promise<string>} 文件内容
   */
  const readFileContent = (file: File): Promise<string> => {
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
   * @returns {Promise<{content: string, modifications: Modification[]}>} 后端响应
   */
  const sendToBackend = async (
    content: string,
  ): Promise<{ content: string; modifications: Modification[] }> => {
    // 这里应该是实际的API调用
    // 为了演示，我们模拟一个响应
    return new Promise((resolve) => {
      setTimeout(() => {
        // 使用图片中的示例数据
        const originalContent = `保密协议

甲方（员工）：
乙方（企业）：

鉴于甲方在乙方处工作，甲方将接触乙方支付的劳务报酬，双方当事人就甲方在任职期间
和离职后保守乙方商业秘密的事项，订定下列条款共同遵守：

第 1 条权属
双方确认，甲方在乙方工作任职期间，因履行职务或者主要是利用乙方的物质技术条件、
业务信息等产生的发明创造，技术秘密或其他商业秘密，有关的知识产权均属于乙方享有，
乙方可以在其业务范围内充分地利用这些发明创造、技术秘密或其他商业秘密，进行生产，
经营或者向第三方转让，甲方应当依乙方的要求，提供一切必要的信息和采取一切必要的
行为，包括申请、注册、登记、公证等，协助乙方取得和行使有关的知识产权。
上述发明创造、技术秘密及其他商业有关的发明权、署名权（依照法律规定应由乙方著
名的除外）等精神权利作为发明人、创作人或开发者的甲方享有，乙方尊重甲方的精神权
利并协助甲方行使这些权利。

第 2 条技术成果
甲方在乙方任职期间所完成的、与乙方业务相关的发明创造、技术秘密或其他商业秘密，
甲方主张由其本人享有知识产权的，应当及时向乙方申明。经乙方核实，认为确属于非职
务成果的，由甲方享有知识产权，乙方不得在未经甲方明确授权的前提下利用这些成果进
行生产、经营、转让或者许可他人实施。`;

        const modifiedContent = simulateModifiedContent(content);

        // 使用 diff 库计算修改点
        const diffResult = Diff.diffLines(originalContent, modifiedContent);
        const modifications = extractModifications(diffResult);

        // 返回结果
        resolve({
          content: modifiedContent,
          modifications,
        });
      }, 2000);
    });
  };

  /**
   * 处理文件上传
   *
   * @param {File} file - 上传的文件对象
   * @returns {boolean} 是否阻止默认上传行为
   */
  const handleFileUpload = async (file: File): Promise<boolean> => {
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
   * @returns {React.ReactElement} 上传文件界面
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
   * @returns {React.ReactElement} 对比结果界面
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
          {/* <ReactDiffViewer
            oldValue={originalContent || ''}
            newValue={modifiedContent || ''}
            splitView
            hideLineNumbers={false}
            showDiffOnly={false}
            // compareMethod={DiffMethod.WORDS}
          /> */}
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
