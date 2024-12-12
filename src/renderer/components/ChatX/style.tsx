import { createStyles } from 'antd-style';

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      height: 600px;
      border-radius: 8px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      flex: 1;
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,

    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    toolWrapper: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    toolIcon: css`
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      &:hover {
        background: #1677ff0f;
      }
    `,
  };
});

export default useStyle;
