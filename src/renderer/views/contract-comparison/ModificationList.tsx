import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Typography, Badge } from 'antd';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import './ModificationList.less';

const { Title, Text } = Typography;

interface Position {
  line: number;
  column?: number;
}

// 接口返回的修改点格式
interface ApiModification {
  type: number; // 1: 新增, 2: 删除, 3: 修改
  info: string;
  text: string;
  position: Position;
}

// 组件内部使用的修改点格式
interface Modification {
  id: number;
  type: string;
  description: string;
  position: Position;
}

interface ModificationListProps {
  modifications: Modification[] | ApiModification[];
}

/**
 * 修改列表组件
 *
 * @param {ModificationListProps} props - 组件属性
 * @returns {React.ReactElement} 修改列表
 */
const ModificationList: React.FC<ModificationListProps> = ({
  modifications,
}) => {
  // 标准化后的修改点列表
  const [normalizedModifications, setNormalizedModifications] = useState<
    Modification[]
  >([]);

  /**
   * 标准化修改点数据
   *
   * @param {Modification[] | ApiModification[]} modifications - 修改点数据
   * @returns {Modification[]} 标准化后的修改点数据
   */
  const normalizeModifications = (
    modifications: Modification[] | ApiModification[],
  ): Modification[] => {
    if (!modifications || modifications.length === 0) {
      return [];
    }

    // 检查是否为 API 返回的格式
    if (
      'type' in modifications[0] &&
      typeof modifications[0].type === 'number'
    ) {
      return (modifications as ApiModification[]).map((mod, index) => {
        const typeMap: { [key: number]: string } = {
          1: '新增',
          2: '删除',
          3: '修改',
        };

        return {
          id: index + 1,
          type: typeMap[mod.type] || '修改',
          description: `${mod.info}: ${mod.text.substring(0, 30)}${mod.text.length > 30 ? '...' : ''}`,
          position: {
            line: mod.position.line,
            column: mod.position.column || 1,
          },
        };
      });
    }

    // 已经是标准格式
    return modifications as Modification[];
  };

  /**
   * 标准化修改点数据
   */
  useEffect(() => {
    const normalized = normalizeModifications(modifications);
    setNormalizedModifications(normalized);
  }, [modifications]);

  /**
   * 获取修改类型对应的图标
   *
   * @param {string} type - 修改类型
   * @returns {React.ReactElement} 图标组件
   */
  const getTypeIcon = (type: string): React.ReactElement => {
    switch (type) {
      case '新增':
        return <PlusCircleOutlined style={{ color: '#52c41a' }} />;
      case '修改':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      case '删除':
        return <DeleteOutlined style={{ color: '#f5222d' }} />;
      default:
        return <EditOutlined />;
    }
  };

  /**
   * 获取修改类型对应的颜色
   *
   * @param {string} type - 修改类型
   * @returns {string} 颜色代码
   */
  const getTypeColor = (type: string): string => {
    switch (type) {
      case '新增':
        return '#52c41a';
      case '修改':
        return '#1890ff';
      case '删除':
        return '#f5222d';
      default:
        return '#faad14';
    }
  };

  /**
   * 获取修改类型的统计数据
   *
   * @returns {Object} 统计数据
   */
  const getModificationStats = () => {
    const stats = {
      total: normalizedModifications.length,
      add: 0,
      edit: 0,
      delete: 0,
    };

    normalizedModifications.forEach((mod) => {
      switch (mod.type) {
        case '新增':
          stats.add += 1;
          break;
        case '修改':
          stats.edit += 1;
          break;
        case '删除':
          stats.delete += 1;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const stats = getModificationStats();

  return (
    <Card className="modification-list-card">
      <Title level={4}>修改点列表</Title>

      <div className="modification-stats">
        <Badge
          count={stats.total}
          overflowCount={999}
          style={{ backgroundColor: '#722ed1' }}
        >
          <Tag color="#722ed1" className="stat-tag">
            总计
          </Tag>
        </Badge>
        <Badge
          count={stats.add}
          overflowCount={999}
          style={{ backgroundColor: '#52c41a' }}
        >
          <Tag color="#52c41a" className="stat-tag">
            新增
          </Tag>
        </Badge>
        <Badge
          count={stats.edit}
          overflowCount={999}
          style={{ backgroundColor: '#1890ff' }}
        >
          <Tag color="#1890ff" className="stat-tag">
            修改
          </Tag>
        </Badge>
        <Badge
          count={stats.delete}
          overflowCount={999}
          style={{ backgroundColor: '#f5222d' }}
        >
          <Tag color="#f5222d" className="stat-tag">
            删除
          </Tag>
        </Badge>
      </div>

      <List
        className="modification-list"
        itemLayout="horizontal"
        dataSource={normalizedModifications}
        renderItem={(item) => (
          <List.Item className="modification-item">
            <List.Item.Meta
              avatar={getTypeIcon(item.type)}
              title={
                <div className="modification-title">
                  <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                  <Text>位置: 第 {item.position.line} 行</Text>
                </div>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ModificationList;
