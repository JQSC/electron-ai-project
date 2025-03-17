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
   * @returns {Promise<{content: string, modificatorList: any[]}>} 后端响应
   */
  const sendToBackend = async (
    content: string,
  ): Promise<{ content: string; modificatorList: any[] }> => {
    // 这里应该是实际的API调用
    // 为了演示，我们模拟一个响应
    return new Promise((resolve) => {
      setTimeout(() => {
        // 使用图片中的示例数据
        const modifiedContent = simulateModifiedContent(content);

        // 使用 diff 库计算修改点
        // const diffResult = Diff.diffLines(originalContent, modifiedContent);

        // const modifications = extractModifications(diffResult);

        const response = {
          content:
            '合同编号：[2023-ABC-123]\n\n合同名称：产品销售合同\n\n甲方（卖方）：\n公司名称：XX贸易有限公司\n地址：XX市XX区XX路XX号\n法定代表人：张三\n联系电话：123-4567-8901\n营业执照编号：123456789012345678\n开户银行及账号：中国银行 XX 分行，账号 123456789012\n\n乙方（买方）：\n公司名称：YY科技有限公司\n地址：XX市XX区XX街XX号\n法定代表人：李四\n联系电话：987-6543-2109\n营业执照编号：987654321098765432\n开户银行及账号：建设银行 XX 分行，账号 987654321098\n\n签订日期：2023年10月10日\n\n签订地点：XX市XX区\n\n合同条款：\n\n1. 产品信息\n产品名称：智能手表\n型号：SW-2023\n数量：1000台\n单价：人民币1500元\n总金额：人民币1500000元（大写：壹佰伍拾万元整）\n\n2. 质量标准\n甲方保证所售产品符合国家相关质量标准（GB/T 12345-2020）。\n\n3. 交货时间与地点\n交货时间：2023年11月10日下午2点\n交货地点：乙方公司仓库（XX市XX区XX街XX号XX仓库，联系人：王五，电话：123-4567-8902）\n\n4. 付款方式\n乙方应在合同签订后3个工作日内通过银行转账方式支付30%的预付款至甲方指定账户，即人民币450000元（大写：肆拾伍万元整）。余款在交货后15个工作日内一次性付清至甲方指定账户。\n\n5. 违约责任\n甲方若未能按时交货，每逾期一日，应向乙方支付合同总金额0.5%的违约金；若因质量问题导致乙方损失，甲方应承担相应赔偿责任。\n乙方若未能按时付款，每逾期一日，应向甲方支付未付款金额0.5%的违约金；若因甲方原因导致乙方无法正常使用产品，乙方有权要求甲方承担相应责任。\n\n6. 争议解决\n本合同在履行过程中如发生争议，双方应友好协商解决。协商不成，可提交甲方所在地人民法院诉讼解决；双方也可选择提交乙方所在地人民法院诉讼解决。\n\n7. 其他条款\n本合同一式两份，甲乙双方各执一份，具有同等法律效力。\n本合同自双方签字盖章之日起生效。\n\n甲方（盖章）：XX贸易有限公司\n法定代表人签字：___________\n日期：2023年10月10日\n\n乙方（盖章）：YY科技有限公司\n法定代表人签字：___________\n日期：2023年10月10日',
          info: '合同主体信息不完整，质量标准条款模糊，交货时间与地点条款不明确，付款方式条款存在漏洞，违约责任条款不均衡，争议解决条款限制性较强，缺少保密条款和不可抗力条款等问题。',
          modificatorList: [
            {
              type: 1,
              info: '新增',
              text: '营业执照编号：123456789012345678\n开户银行及账号：中国银行 XX 分行，账号 123456789012',
              position: { line: 6 },
            },
            {
              type: 1,
              info: '新增',
              text: '营业执照编号：987654321098765432\n开户银行及账号：建设银行 XX 分行，账号 987654321098',
              position: { line: 14 },
            },
            {
              type: 3,
              info: '修改',
              text: '甲方保证所售产品符合国家相关质量标准（GB/T 12345-2020）。',
              position: { line: 24 },
            },
            {
              type: 3,
              info: '修改',
              text: '交货时间：2023年11月10日下午2点\n交货地点：乙方公司仓库（XX市XX区XX街XX号XX仓库，联系人：王五，电话：123-4567-8902）',
              position: { line: 27 },
            },
            {
              type: 3,
              info: '修改',
              text: '乙方应在合同签订后3个工作日内通过银行转账方式支付30%的预付款至甲方指定账户，即人民币450000元（大写：肆拾伍万元整）。余款在交货后15个工作日内一次性付清至甲方指定账户。',
              position: { line: 32 },
            },
            {
              type: 3,
              info: '修改',
              text: '甲方若未能按时交货，每逾期一日，应向乙方支付合同总金额0.5%的违约金；若因质量问题导致乙方损失，甲方应承担相应赔偿责任。\n乙方若未能按时付款，每逾期一日，应向甲方支付未付款金额0.5%的违约金；若因甲方原因导致乙方无法正常使用产品，乙方有权要求甲方承担相应责任。',
              position: { line: 37 },
            },
            {
              type: 3,
              info: '修改',
              text: '本合同在履行过程中如发生争议，双方应友好协商解决。协商不成，可提交甲方所在地人民法院诉讼解决；双方也可选择提交乙方所在地人民法院诉讼解决。',
              position: { line: 46 },
            },
            {
              type: 1,
              info: '新增',
              text: '8. 保密条款\n双方应对在合同履行过程中知悉的对方商业秘密和技术秘密予以保密，未经对方书面同意，不得向第三方披露。保密期限为合同终止后5年。如一方违反保密义务，应向对方支付违约金人民币100000元（大写：壹拾万元整），并赔偿对方因此遭受的全部损失。\n\n9. 不可抗力条款\n不可抗力是指不能预见、不能避免并不能克服的客观情况。因不可抗力导致合同无法履行的，受影响方应在不可抗力发生后10日内书面通知对方，并提供相关证明文件。双方应协商解决合同履行问题，若不可抗力持续时间超过30日，双方均有权解除合同，且互不承担违约责任。',
              position: { line: 51 },
            },
          ],
        };

        // 返回结果
        resolve(response);
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
      // 使用 modificatorList 作为修改点列表
      setModifications(response.modificatorList || []);

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
