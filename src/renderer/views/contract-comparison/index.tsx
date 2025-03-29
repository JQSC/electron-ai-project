import React, { useState } from 'react';
import {
  Upload,
  Button,
  Row,
  Col,
  Card,
  Spin,
  message,
  Tabs,
  Modal,
  Input,
  Form,
  Select,
} from 'antd';
import { InboxOutlined, SaveOutlined } from '@ant-design/icons';
import * as Diff from 'diff';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import ContractDiffViewer from './ContractDiffViewer';
import ModificationList from './ModificationList';
import './index.less';

const { Dragger } = Upload;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

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
  // 选择的文件路径
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  // 保存记录模态框可见性
  const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);
  // 记录表单
  const [recordForm] = Form.useForm();

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
            '\n\n抖音代运营协议\n\n甲方（受托方）：宁夏xxxx科技有限公司\n\n法定代表人：王二\n\n地址：宁夏人工智能产业园二楼西侧\n\n联系方式：185xxxxxxx2\n\n乙方（委托方）：宁夏金积醋业有限公司\n\n法定代表人：徐xx\n\n地址：吴忠市金积工业园区\n\n联系方式：130xxxxxxx\n\n现甲、乙双方本着平等互利的原则，并经友好商洽，就《抖音代运营协议》的签订达成一致意见。双方约定如下：\n\n一、协议目的\n\n1.1 甲方为乙方进行抖音代运营服务。\n\n1.2 乙方同意委托甲方进行抖音店铺的代运营服务，确保乙方的抖音店铺良好运营，并取得业务发展。\n\n二、服务内容\n\n2.1 账号管理：甲方负责乙方抖音店铺的账号管理、直播运营等工作，确保账号安全及正常运营。\n\n2.2 商品上架：甲方将根据乙方提供的商品信息和图片，以及抖音平台规范要求，在规定时间内完成商品上架工作。乙方应确保提供的商品信息真实、准确、完整，并符合相关法律法规及平台要求。\n\n2.3 活动推广：甲方将根据与乙方协商结果，开展相应的推广工作以及活动申报，包括但不限于直播、推广、视频拍摄等业务。具体活动方案及预算需经乙方书面确认后方可执行。\n\n2.4 乙方产品在抖音平台销售价格由乙方决定，甲方有权提出建议。产品成本及邮费由乙方承担，具体包括：9.9元3瓶800ml陈醋或1瓶2.5L陈醋，成本价7.2元包邮（乙方承担）；39.9元1瓶2.7L 6°陈醋，成本价13.4元包邮（乙方承担）。\n\n三、服务期限\n\n3.1 本协议有效期自2022年4月1日起至2023年7月1日止。\n\n3.2 协议期届满前15日，如双方未书面提出异议，则自动续期3个月。续期期间，双方的权利义务仍按照本协议执行。\n\n四、代运营服务报酬及费用承担\n\n4.1 乙方支付给甲方的代运营服务报酬为店铺销售额的百分之十，每月结算一次，于当月30日之前结算完毕。若乙方未按约定时间支付服务报酬，则视为违约，违约金为未支付金额的10%。\n\n4.2 直播人员及短视频运营人员工资由乙方承担。直播人员工资一场为300元人民币，4小时为一场，不足4小时按4小时计算。结算以甲方提供的工资表为准，乙方有权对工资表进行审核。结算方式为日结，乙方应于每日工作结束后24小时内支付当日工资。\n\n4.3 乙方必须每日向甲方结清当日人员工资以保证推广业务正常推进，若乙方超过三个工作日未向甲方支付工资，视为乙方违约，甲方有权暂停项目，乙方需向甲方支付实际用工工资的5倍作为赔偿，直至乙方付款后项目方可再次启动。具体工资以附件为准，附件应作为本协议不可分割的一部分。\n\n4.4 推广所涉及投流费用由乙方承担，乙方需无条件配合。乙方如有异议，应提前7个工作日以书面形式告知甲方。如未提出异议中途叫停，需向甲方赔偿合同金额的30%作为违约金。若乙方投流达到27万人民币，甲方应尽合理努力保证乙方销售额可达到40万-200万人民币，但不承担最终销售额未达到该范围的违约责任，具体销售额受市场因素影响，双方应共同协商应对策略。\n\n五、知识产权保护\n\n甲方承诺，将严格按照法律法规及抖音平台规定，保护乙方知识产权，确保乙方抖音店铺的合法稳定经营。乙方应确保其提供的商品及信息不侵犯任何第三方的知识产权，否则由此产生的法律责任由乙方自行承担。\n\n六、保密条款\n\n6.1 双方应对本协议中的商业、财务、技术等涉及商业机密的信息进行绝对保密，对于泄密给对方造成的损失，由泄密方承担全部责任。保密期限为本协议生效之日起至协议终止后3年。\n\n6.2 双方应对本协议中的条款及协议签订情况保持机密，未经对方书面同意，不得向任何第三方披露。\n\n七、违约责任\n\n若一方违反本协议条款，导致对方受到损失，应承担违约责任，并对对方损失进行赔偿。违约金的具体金额根据违约情况确定，但不得低于违约行为给守约方造成的直接损失的10%。\n\n八、协议变更\n\n8.1 本协议的任何修改均需双方协商一致，并签署补充协议。补充协议应明确修改内容及生效时间。\n\n8.2 补充协议的效力与本协议相同，如补充协议与本协议内容不一致，以补充协议为准。\n\n九、协议终止\n\n9.1 本协议期满终止，双方的权利义务自然终止，但本协议第七条、第八条、第九条及保密条款继续有效。\n\n9.2 本协议在协议期内，当甲、乙双方条件变更，或申请解除本协议，必须提前1个月书面通知对方并经协商一致解除。任何一方未经协商擅自解除协议的，应向对方支付违约金，违约金金额为本协议总金额的20%。\n\n十、适用法律与争议解决\n\n10.1 本协议适用中华人民共和国法律。\n\n10.2 双方在执行本协议过程中产生的争议，应首先通过友好协商解决；协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。\n\n甲方（盖章）：\n\n法定代表人或授权代表（签字）：\n\n签订日期：年____月____日\n\n乙方（盖章）：________________\n\n法定代表人或授权代表（签字）：__________________\n\n签订日期：______年____月____日',
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

      const fileContent = await window.electronAPI.readFileContent(file.path);

      setOriginalContent(fileContent);

      // 调用后端接口获取修改后的文档内容
      const response = await sendToBackend(fileContent);
      setModifiedContent(response.content);
      // 使用 modificatorList 作为修改点列表
      setModifications(response.modificatorList || []);

      // 切换到对比结果步骤
      setCurrentStep(2);
      message.success('文档分析完成');
    } catch (error: any) {
      console.error('处理文件时出错:', error);
      message.error(`处理文件时出错: ${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }

    // 阻止默认上传行为
    return false;
  };

  /**
   * 处理本地文件选择
   */
  const handleLocalFileSelect = async () => {
    try {
      // 打开文件选择对话框
      const filePath = await window.electronAPI.openFile();

      if (filePath) {
        setSelectedFilePath(filePath);
        setLoading(true);

        try {
          console.log('filePath', filePath);
          // 读取文件内容
          const fileContent =
            await window.electronAPI.readFileContent(filePath);

          console.log('fileContent', fileContent);
          setOriginalContent(fileContent);

          // 调用后端接口获取修改后的文档内容
          const response = await sendToBackend(fileContent);
          setModifiedContent(response.content);
          // 使用 modificatorList 作为修改点列表
          setModifications(response.modificatorList || []);

          // 切换到对比结果步骤
          setCurrentStep(2);
          message.success('文档分析完成');
        } catch (error: any) {
          console.error('处理文件时出错:', error);
          message.error(`处理文件时出错: ${error.message || '未知错误'}`);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('选择文件时出错:', error);
      message.error('选择文件时出错，请重试');
    }
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
   * 打开保存记录模态框
   */
  const showSaveModal = () => {
    // 提取文件名作为标题（如果有）
    const fileName = selectedFilePath.split(/[/\\]/).pop() || '未命名合同';

    recordForm.setFieldsValue({
      title: fileName,
      reviewer: '',
      remarks: '',
    });

    setSaveModalVisible(true);
  };

  /**
   * 保存合同审核记录
   */
  const saveContractRecord = async (values: any) => {
    if (!originalContent || !modifiedContent) {
      message.error('合同内容不完整，无法保存');
      return;
    }

    try {
      const recordData = {
        ...values,
        originalContent,
        reviewedContent: modifiedContent,
        status: 'approved', // 默认状态为已通过
      };

      const response =
        await window.electronAPI.db.addContractRecord(recordData);

      if (response.success) {
        message.success('合同对比记录保存成功');
        setSaveModalVisible(false);
      } else {
        message.error(response.error || '保存合同对比记录失败');
      }
    } catch (error: any) {
      console.error('保存合同对比记录失败:', error);
      message.error(`保存失败: ${error.message || '未知错误'}`);
    }
  };

  /**
   * 渲染上传文件步骤
   *
   * @returns {React.ReactElement} 上传文件界面
   */
  const renderUploadStep = () => (
    <Card className="upload-card">
      <div className="upload-options">
        <Dragger
          name="file"
          multiple={false}
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept=".doc,.docx,.pdf,.txt"
          customRequest={() => handleLocalFileSelect()}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .doc, .docx, .pdf, .txt 格式的合同文件
          </p>
        </Dragger>
      </div>
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
        <div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={showSaveModal}
            style={{ marginRight: 16 }}
          >
            保存对比记录
          </Button>
          <Button type="primary" onClick={handleReupload}>
            重新上传
          </Button>
        </div>
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

      {/* 保存记录模态框 */}
      <Modal
        title="保存合同对比记录"
        open={saveModalVisible}
        onOk={() => recordForm.submit()}
        onCancel={() => setSaveModalVisible(false)}
        width={600}
      >
        <Form form={recordForm} layout="vertical" onFinish={saveContractRecord}>
          <Form.Item
            name="title"
            label="合同标题"
            rules={[{ required: true, message: '请输入合同标题' }]}
          >
            <Input placeholder="请输入合同标题" />
          </Form.Item>
          <Form.Item
            name="reviewer"
            label="审核人"
            rules={[{ required: true, message: '请输入审核人' }]}
          >
            <Input placeholder="请输入审核人姓名" />
          </Form.Item>
          <Form.Item name="remarks" label="备注">
            <TextArea rows={4} placeholder="请输入备注信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractComparison;
