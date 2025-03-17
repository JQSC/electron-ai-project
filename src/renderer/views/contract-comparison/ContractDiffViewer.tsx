import React, { useEffect, useState } from 'react';
import { Card, Tabs, Badge, Tooltip } from 'antd';
import * as Diff from 'diff';
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
  // 差异对比结果
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
  // 当前活动的标签页
  const [activeTab, setActiveTab] = useState<string>('diff');
  // 行级别的差异映射
  const [lineDiffMap, setLineDiffMap] = useState<{
    original: { [key: number]: string };
    modified: { [key: number]: string };
  }>({ original: {}, modified: {} });

  /**
   * 计算行级别的差异映射
   *
   * @param {string[]} originalLines - 原始文档行
   * @param {string[]} modifiedLines - 修改后文档行
   * @returns {{ original: { [key: number]: string }, modified: { [key: number]: string } }} 差异映射
   */
  const calculateLineDiffMapping = (
    originalLines: string[],
    modifiedLines: string[],
  ) => {
    const mapping = {
      original: {} as { [key: number]: string },
      modified: {} as { [key: number]: string },
    };

    // 使用 diff-match-patch 算法计算更精确的行级别差异
    const diffResult = Diff.diffArrays(originalLines, modifiedLines);

    let originalIndex = 0;
    let modifiedIndex = 0;

    diffResult.forEach((part) => {
      const count = part.count || 0;

      if (part.removed) {
        // 标记删除的行
        for (let i = 0; i < count; i++) {
          mapping.original[originalIndex + i] = 'removed';
        }
        originalIndex += count;
      } else if (part.added) {
        // 标记新增的行
        for (let i = 0; i < count; i++) {
          mapping.modified[modifiedIndex + i] = 'added';
        }
        modifiedIndex += count;
      } else {
        // 未修改的行
        originalIndex += count;
        modifiedIndex += count;
      }
    });

    // 对比每一行的内容，标记修改的行
    const minLength = Math.min(originalLines.length, modifiedLines.length);
    for (let i = 0; i < minLength; i++) {
      if (
        originalLines[i] !== modifiedLines[i] &&
        !mapping.original[i] &&
        !mapping.modified[i]
      ) {
        mapping.original[i] = 'modified';
        mapping.modified[i] = 'modified';
      }
    }

    return mapping;
  };

  /**
   * 处理文档内容，将其分割为行并计算差异
   */
  useEffect(() => {
    if (originalContent && modifiedContent) {
      // 分割文本为行
      const origLines = originalContent.split('\n');
      const modLines = modifiedContent.split('\n');

      setOriginalLines(origLines);
      setModifiedLines(modLines);

      // 计算差异
      const diffResult = Diff.diffLines(originalContent, modifiedContent);
      setDiffResult(diffResult);

      // 计算行级别的差异映射
      const lineDiffMapping = calculateLineDiffMapping(origLines, modLines);
      setLineDiffMap(lineDiffMapping);
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
      case 'added':
      case '新增':
        return '#52c41a';
      case 'modified':
      case '修改':
        return '#1890ff';
      case 'removed':
      case '删除':
        return '#f5222d';
      default:
        return '#faad14';
    }
  };

  /**
   * 获取修改类型对应的标签文本
   *
   * @param {string} diffType - 差异类型
   * @returns {string} 标签文本
   */
  const getDiffTypeLabel = (diffType: string): string => {
    if (diffType === 'added') {
      return '新增';
    }
    if (diffType === 'removed') {
      return '删除';
    }
    return '修改';
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
    const diffMap = isOriginal ? lineDiffMap.original : lineDiffMap.modified;

    return lines.map((line, index) => {
      const diffType = diffMap[index];
      const hasModification = !!diffType;
      const modification = getLineModification(index);

      // 如果是原始文档中的新增行，不显示
      const shouldDisplayBadge = !(isOriginal && diffType === 'added');

      return (
        <div
          key={`${isOriginal ? 'original' : 'modified'}-line-${index}`}
          className={`document-line ${hasModification ? `diff-${diffType}` : ''}`}
          style={{
            backgroundColor: hasModification
              ? `${getModificationColor(diffType)}20`
              : 'transparent',
            borderLeft: hasModification
              ? `3px solid ${getModificationColor(diffType)}`
              : 'none',
          }}
        >
          <span className="line-number">{index + 1}</span>
          <span className="line-content">
            {line}
            {hasModification && shouldDisplayBadge && (
              <Badge
                count={getDiffTypeLabel(diffType)}
                style={{
                  backgroundColor: getModificationColor(diffType),
                  display: 'block',
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
   * 渲染差异对比视图
   *
   * @returns {React.ReactElement} 差异对比视图
   */
  const renderDiffView = () => {
    return (
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
  };

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

  /**
   * 获取内联差异样式
   *
   * @param {boolean} isAdded - 是否为新增内容
   * @param {boolean} isRemoved - 是否为删除内容
   * @returns {{ className: string, style: React.CSSProperties }} 样式对象
   */
  const getInlineDiffStyle = (isAdded: boolean, isRemoved: boolean) => {
    let className = '';
    const style: React.CSSProperties = {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    };

    if (isAdded) {
      className = 'diff-word-added';
      style.backgroundColor = 'rgba(82, 196, 26, 0.2)';
    } else if (isRemoved) {
      className = 'diff-word-removed';
      style.backgroundColor = 'rgba(255, 82, 82, 0.2)';
      style.textDecoration = 'line-through';
    }

    return { className, style };
  };

  /**
   * 渲染内联差异视图
   *
   * @returns {React.ReactElement} 内联差异视图
   */
  const renderInlineDiffView = () => {
    // 使用 diffWords 来获取更细粒度的差异
    const combinedContent = modifiedContent;
    const lines = combinedContent.split('\n');

    return (
      <div className="single-view">
        <div className="document-header">内联差异视图</div>
        <div className="document-content">
          {lines.map((line, lineIndex) => {
            // 对每一行进行单词级别的差异比较
            const originalLine =
              lineIndex < originalLines.length ? originalLines[lineIndex] : '';
            const wordDiff = Diff.diffWords(originalLine, line);

            return (
              <div key={`inline-diff-${lineIndex}`} className="document-line">
                <span className="line-number">{lineIndex + 1}</span>
                <span className="line-content">
                  {wordDiff.map((part, partIndex) => {
                    const { className, style } = getInlineDiffStyle(
                      !!part.added,
                      !!part.removed,
                    );
                    return (
                      <span
                        key={`part-${partIndex}`}
                        className={className}
                        style={style}
                      >
                        {part.value}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="contract-diff-viewer">
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="对比视图" key="diff">
          {renderDiffView()}
        </TabPane>
        <TabPane tab="内联差异" key="inline">
          {renderInlineDiffView()}
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
