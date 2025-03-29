/**
 * 合同对比记录页面
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Space,
  message,
  Popconfirm,
  Modal,
  Typography,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import type { ContractRecord } from '../../../main/services/db';
import ContractDiffViewer from '../contract-comparison/ContractDiffViewer';

const { Title, Text } = Typography;

// 定义查询表单字段
interface SearchFormValues {
  title?: string;
  reviewer?: string;
}

const ContractRecords: React.FC = () => {
  // 状态管理
  const [records, setRecords] = useState<ContractRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchForm] = Form.useForm<SearchFormValues>();
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewRecord, setViewRecord] = useState<ContractRecord | null>(null);
  const [diffModalVisible, setDiffModalVisible] = useState<boolean>(false);

  // 获取合同记录列表
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.db.getContractRecords();
      if (response.success) {
        setRecords(response.data || []);
      } else {
        message.error(response.error || '获取合同对比记录列表失败');
      }
    } catch (error) {
      console.error('获取合同对比记录列表失败:', error);
      message.error('获取合同对比记录列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索合同记录
  const searchRecords = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      const response =
        await window.electronAPI.db.searchContractRecords(values);
      if (response.success) {
        setRecords(response.data || []);
      } else {
        message.error(response.error || '搜索合同对比记录失败');
      }
    } catch (error) {
      console.error('搜索合同对比记录失败:', error);
      message.error('搜索合同对比记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const resetSearch = () => {
    searchForm.resetFields();
    fetchRecords();
  };

  // 删除合同记录
  const deleteRecord = async (id: number) => {
    try {
      const response = await window.electronAPI.db.deleteContractRecord(id);
      if (response.success) {
        message.success('删除合同对比记录成功');
        fetchRecords();
      } else {
        message.error(response.error || '删除合同对比记录失败');
      }
    } catch (error) {
      console.error('删除合同对比记录失败:', error);
      message.error('删除合同对比记录失败');
    }
  };

  // 打开查看合同记录模态框
  const showViewModal = (record: ContractRecord) => {
    setViewRecord(record);
    setViewModalVisible(true);
  };

  // 打开合同对比结果模态框
  const showDiffModal = (record: ContractRecord) => {
    setViewRecord(record);
    setDiffModalVisible(true);
  };

  // 处理查看模态框关闭
  const handleViewModalCancel = () => {
    setViewModalVisible(false);
    setViewRecord(null);
  };

  // 处理对比模态框关闭
  const handleDiffModalCancel = () => {
    setDiffModalVisible(false);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string): 'success' | 'danger' | 'warning' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  // 获取状态中文名称
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '审核中';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知';
    }
  };

  // 表格列定义
  const columns: TableProps<ContractRecord>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '合同标题',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      ellipsis: true,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="查看详情"
            onClick={() => showViewModal(record)}
          />
          <Button
            type="text"
            icon={<FileTextOutlined />}
            title="查看对比结果"
            onClick={() => showDiffModal(record)}
          />
          <Popconfirm
            title="确定要删除此记录吗？"
            onConfirm={() => deleteRecord(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="删除" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 初始化加载
  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <Card title="合同对比记录" style={{ margin: 24 }}>
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={searchRecords}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="title" label="合同标题">
          <Input placeholder="请输入合同标题" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="reviewer" label="审核人">
          <Input placeholder="请输入审核人" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button onClick={resetSearch}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 合同记录表格 */}
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* 查看详情模态框 */}
      <Modal
        title="合同记录详情"
        open={viewModalVisible}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="close" onClick={handleViewModalCancel}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {viewRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>{viewRecord.title}</Title>
              <Space>
                <Text type="secondary">审核人: {viewRecord.reviewer}</Text>
                <Text type={getStatusColor(viewRecord.status)}>
                  状态: {getStatusText(viewRecord.status)}
                </Text>
                <Text type="secondary">
                  创建时间:{' '}
                  {new Date(viewRecord.createTime).toLocaleString('zh-CN')}
                </Text>
                <Text type="secondary">
                  更新时间:{' '}
                  {new Date(viewRecord.updateTime).toLocaleString('zh-CN')}
                </Text>
              </Space>
            </div>

            {viewRecord.remarks && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>备注</Title>
                <Card>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {viewRecord.remarks}
                  </div>
                </Card>
              </div>
            )}

            <div>
              <Button type="primary" onClick={() => showDiffModal(viewRecord)}>
                查看对比结果
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 对比结果模态框 */}
      <Modal
        title="合同对比结果"
        open={diffModalVisible}
        onCancel={handleDiffModalCancel}
        footer={[
          <Button key="close" onClick={handleDiffModalCancel}>
            关闭
          </Button>,
        ]}
        width="90%"
        bodyStyle={{ height: 'calc(90vh - 200px)', overflow: 'auto' }}
      >
        {viewRecord && (
          <div>
            <Title level={4}>{viewRecord.title}</Title>
            <Divider />
            <ContractDiffViewer
              originalContent={viewRecord.originalContent || ''}
              modifiedContent={viewRecord.reviewedContent || ''}
              modifications={[]} // 这里需要从记录中提取修改点，或者在对比界面中重新计算
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ContractRecords;
