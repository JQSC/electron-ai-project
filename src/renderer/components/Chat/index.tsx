import { ProChat } from '@ant-design/pro-chat';
import { LLMGenerateOptions } from '../../../types/ipc';

export default ({ data }: { data: LLMGenerateOptions }) => {
  // const handleRequest = async (messages: any) => {
  //   const content = await window.electronAPI.generate(data);
  // };

  return (
    <ProChat
      displayMode="docs"
      helloMessage="欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)"
      request={async (messages) => {
        const mockedData: string = `这是一段模拟的对话数据。本次会话传入了${messages.length}条消息`;
        console.log(messages);
        return new Response(mockedData);
      }}
    />
  );
};
