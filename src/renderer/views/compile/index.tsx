import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Space,
  Typography,
  Spin,
  message,
  Button,
  Input,
  Form,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

/**
 * 格式化持续时间（毫秒转为可读格式）
 * @param {number} ms - 毫秒数
 * @returns {string} 格式化后的时间字符串
 */
const durationFormat = (ms: number): string => {
  const seconds = (ms / 1000).toFixed(1);
  if (parseFloat(seconds) >= 60) {
    const m = Math.floor(parseFloat(seconds) / 60);
    const s = (parseFloat(seconds) % 60).toFixed(1);
    return `${m}分${s}秒`;
  }
  if (seconds === '0.0') {
    return '0秒';
  }
  return `${seconds}秒`;
};

/**
 * 计算构建总时长
 * @param {Array} timeline - 时间线数组
 * @returns {string} 格式化后的总时长
 */
const calculateTotalDuration = (timeline: any[]): string => {
  if (!timeline || timeline.length === 0) {
    return '--';
  }

  const buildItem =
    timeline.filter((item) => item.blockName === 'build-project')?.[0] || {};
  const duration = buildItem.duration || -1;
  if (duration === -1) {
    return '--';
  }

  return durationFormat(duration);
};

/**
 * 获取毫秒时长
 * @param {Array} timeline - 时间线数组
 * @returns {number} 总时长（毫秒）
 */
const getTotalDurationMs = (timeline: any[]): number => {
  if (!timeline || timeline.length === 0) {
    return 0;
  }

  return timeline.reduce((total, item) => total + (item.duration || 0), 0);
};

/**
 * 编译项目列表页面组件
 */
const CompilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [projectOptions, setProjectOptions] = useState<string[]>([]);

  useEffect(() => {
    // 获取数据
    const fetchData = async () => {
      try {
        setLoading(true);
        // 使用IPC通信获取数据
        const result =
          await window.electron.ipcRenderer.invoke('compile:getData');

        if (result && result.status === 'success') {
          const dataList = result.data.dataList || [];
          setDataSource(dataList);
          setFilteredData(dataList);

          // 提取所有不同的项目名称
          const projects = Array.from(
            new Set(
              dataList
                .map((item: any) => item.detail?.projectName)
                .filter(Boolean),
            ),
          ) as string[];
          setProjectOptions(projects);
        } else {
          message.error(result.message || '获取数据失败');
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 处理筛选表单提交
   * @param {object} values - 表单值
   */
  const handleFilterSubmit = (values: any) => {
    const { projectName, minDuration, maxDuration } = values;

    let filtered = [...dataSource];

    // 按项目名称筛选
    if (projectName) {
      filtered = filtered.filter(
        (item) => item.detail?.projectName === projectName,
      );
    }

    // 按最小构建时长筛选（毫秒）
    if (minDuration) {
      const minMs = minDuration * 1000; // 秒转毫秒
      filtered = filtered.filter(
        (item) => getTotalDurationMs(item.timeline) >= minMs,
      );
    }

    // 按最大构建时长筛选（毫秒）
    if (maxDuration) {
      const maxMs = maxDuration * 1000; // 秒转毫秒
      filtered = filtered.filter(
        (item) => getTotalDurationMs(item.timeline) <= maxMs,
      );
    }

    setFilteredData(filtered);
  };

  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    form.resetFields();
    setFilteredData(dataSource);
  };

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: ['detail', 'projectName'],
      key: 'projectName',
      render: (text: string, record: any) => (
        <Button type="link" onClick={() => console.log('查看详情', record.id)}>
          {text || '未知项目'}
        </Button>
      ),
    },
    {
      title: '构建时长',
      key: 'buildDuration',
      render: (text: any, record: any) => {
        return calculateTotalDuration(record.timeline);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '待执行', color: 'default' },
          1: { text: '执行中', color: 'processing' },
          2: { text: '已完成', color: 'success' },
          3: { text: '失败', color: 'error' },
        };

        const { text, color } = statusMap[status] || {
          text: '未知',
          color: 'default',
        };

        let textColor = 'inherit';
        if (color === 'error') {
          textColor = 'red';
        } else if (color === 'success') {
          textColor = 'green';
        }

        return <span style={{ color: textColor }}>{text}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => {
        if (!text) return '--';
        return new Date(text).toLocaleString('zh-CN');
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 筛选表单 */}
          <Card size="small" title="筛选条件">
            <Form form={form} layout="horizontal" onFinish={handleFilterSubmit}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="项目名称" name="projectName">
                    <Select
                      allowClear
                      placeholder="选择项目"
                      style={{ width: '100%' }}
                    >
                      {projectOptions.map((project) => (
                        <Option key={project} value={project}>
                          {project}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="最小时长(秒)" name="minDuration">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="最大时长(秒)" name="maxDuration">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        筛选
                      </Button>
                      <Button onClick={handleReset}>重置</Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Spin spinning={loading}>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Spin>
        </Space>
      </Card>
    </div>
  );
};

export default CompilePage;
