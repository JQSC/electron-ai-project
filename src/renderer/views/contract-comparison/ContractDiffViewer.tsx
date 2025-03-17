import React, { useEffect, useState } from 'react';
import { Card, Tabs, Badge } from 'antd';
import './ContractDiffViewer.less';

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

interface ContractDiffViewerProps {
  originalContent: string;
  modifiedContent: string;
  modifications: Modification[];
}

/**
 * 合同对比查看器组件
 *
 * @param {ContractDiffViewerProps} props - 组件属性
 * @returns {React.ReactElement} 合同对比查看器
 */
const ContractDiffViewer: React.FC<ContractDiffViewerProps> = ({
  originalContent,
  modifiedContent,
  modifications,
}) => {
  // 原始文档行数组
  const [originalLines, setOriginalLines] = useState<string[]>([]);
  // 修改后文档行数组
  const [modifiedLines, setModifiedLines] = useState<string[]>([]);
  // 当前活动的标签页
  const [activeTab, setActiveTab] = useState<string>('diff');

  /**
   * 处理文档内容，将其分割为行
   */
  useEffect(() => {
    if (originalContent) {
      setOriginalLines(originalContent.split('\n'));
    }
    if (modifiedContent) {
      setModifiedLines(modifiedContent.split('\n'));
    }
  }, [originalContent, modifiedContent]);

  /**
   * 获取修改类型对应的颜色
   *
   * @param {string} type - 修改类型
   * @returns {string} 颜色代码
   */
  const getModificationColor = (type: string): string => {
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
   * 检查行是否有修改
   *
   * @param {number} lineIndex - 行索引
   * @returns {Modification | null} 修改信息或null
   */
  const getLineModification = (lineIndex: number): Modification | null => {
    return (
      modifications.find((mod) => mod.position.line === lineIndex + 1) || null
    );
  };

  /**
   * 渲染文档行
   *
   * @param {string[]} lines - 文档行数组
   * @param {boolean} isOriginal - 是否为原始文档
   * @returns {React.ReactElement[]} 渲染的文档行
   */
  const renderLines = (lines: string[], isOriginal: boolean) => {
    return lines.map((line, index) => {
      const modification = getLineModification(index);
      const hasModification = modification !== null;

      return (
        <div
          key={`${isOriginal ? 'original' : 'modified'}-line-${index}`}
          className={`document-line ${hasModification ? 'modified-line' : ''}`}
          style={{
            backgroundColor: hasModification
              ? `${getModificationColor(modification.type)}20`
              : 'transparent',
            borderLeft: hasModification
              ? `3px solid ${getModificationColor(modification.type)}`
              : 'none',
          }}
        >
          <span className="line-number">{index + 1}</span>
          <span className="line-content">
            {line}
            {hasModification && !isOriginal && (
              <Badge
                count={modification.type}
                style={{
                  backgroundColor: getModificationColor(modification.type),
                }}
                className="modification-badge"
              />
            )}
          </span>
        </div>
      );
    });
  };

  /**
   * 渲染对比视图
   *
   * @returns {React.ReactElement} 对比视图
   */
  const renderDiffView = () => (
    <div className="diff-view">
      <div className="document-panel">
        <div className="document-header">原始文档</div>
        <div className="document-content">
          {renderLines(originalLines, true)}
        </div>
      </div>
      <div className="document-panel">
        <div className="document-header">修改后文档</div>
        <div className="document-content">
          {renderLines(modifiedLines, false)}
        </div>
      </div>
    </div>
  );

  /**
   * 渲染单一文档视图
   *
   * @param {string[]} lines - 文档行数组
   * @param {string} title - 视图标题
   * @param {boolean} isOriginal - 是否为原始文档
   * @returns {React.ReactElement} 单一文档视图
   */
  const renderSingleView = (
    lines: string[],
    title: string,
    isOriginal: boolean,
  ) => (
    <div className="single-view">
      <div className="document-header">{title}</div>
      <div className="document-content">{renderLines(lines, isOriginal)}</div>
    </div>
  );

  return (
    <Card className="contract-diff-viewer">
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="对比视图" key="diff">
          {renderDiffView()}
        </TabPane>
        <TabPane tab="原始文档" key="original">
          {renderSingleView(originalLines, '原始文档', true)}
        </TabPane>
        <TabPane tab="修改后文档" key="modified">
          {renderSingleView(modifiedLines, '修改后文档', false)}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ContractDiffViewer;
