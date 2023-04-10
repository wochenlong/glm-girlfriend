import { Context, Schema, Session, h } from "koishi";

export const name = "glm-girlfriend";

export const usage = `
### 用前需知

本插件基于 [TomLBZ](https://github.com/TomLBZ) 的 [koishi-plugin-openai](https://github.com/TomLBZ/koishi-plugin-openai) 插件进行开发。

**机器有三种情况会回复你的对话：**

1. 被叫到名字
2. 自己被@
3. 随机回复



如果发现机器人说话吞吞吐吐的，可能是达到最大对话字数

这时输入"重置对话" 或"清除记忆"可以清除机器人的记忆

### 服务器地址格式

应为 \`https://服务器地址/chatglm?\`

自建后端部署 chatglm 后需要安装配套的 api 文件，[点击下载](https://github.com/wochenlong/ChatGLM-6B-with-flask-api)。

### 更新日志：
0.6.2：修复了source参数没有发送的错误，不会再显示“无来源的请求，请更新插件”

`;

export interface Config {
  apiAddress: string;
  botname: string;
  memoryShortLength: number;
  randomReplyFrequency: number;
  chatid: number;
}

export const Config: Schema<Config> = Schema.object({
  apiAddress: Schema.string().description("后端服务器地址").default(""),
  botname: Schema.string().description("机器人的名字").default("风灵"),
  memoryShortLength: Schema.number()
    .max(16)
    .min(2)
    .description("机器人的短期记忆（位于内存中）长度")
    .default(4),
  randomReplyFrequency: Schema.number()
    .max(10)
    .min(0)
    .description("机器人未被直接呼叫（未被@、未被直呼其名）时的随机回复概率")
    .step(0.1)
    .default(0.5),
  chatid: Schema.number()
    .description("你的对话id，1到10万范围内随机填一位,必填")

    .required(),
});

const conversation = new Map<string, Map<string, string>>();

function getReplyCondition(session: Session, config: Config) {
  // 如果当前会话的类型为 "group"
  if (session.subtype === "group") {
    // 如果会话内容中包含机器人名字，或者被@了机器人，则满足回复条件
    if (session.parsed.appel || session.content.includes(config.botname)) {
      return true;
    }
    // 如果当前消息没有被@机器人，而且随机数小于设定的阈值，则满足回复条件
    else if (Math.random() < config.randomReplyFrequency) {
      return true;
    }
    // 如果不满足上述两个条件，则不满足回复条件
    return false;
  }
  // 如果当前会话的类型不是 "group"，则满足回复条件
  else {
    return true;
  }
}

export function apply(ctx: Context, config: Config) {
  // 在 koishi 的中间件栈中添加一个中间件函数
  ctx.middleware(async (session, next) => {
    const apiAddress = config.apiAddress;
    let msgmemory = session.content;
    // 如果当前消息来自 koishi 机器人本身，则忽略该消息
    if (ctx.bots[session.uid]) {
      return;
    }
    // 如果消息符合回复条件
    if (getReplyCondition(session, config)) {
      // 获取消息历史记录中的最后四个字符，并去掉两端的空格
      // 如果消息历史记录为 "重置对话" 或 "重置"，则将消息内容设置为 "clear"
      let userText = session.content;
      let chat_id = config.chatid; // chat_id 的默认值为 100000

      if (msgmemory === "重置对话" || msgmemory === "清除记忆") {
        userText = "clear";
        // 如果是重置对话或清除记忆，chat_id 加上一个 100000 以内的随机数
        chat_id += Math.floor(Math.random() * 100000);
        const resetMessage = `chatglm历史记忆已经重置，新的 chat_id 为 ${chat_id}`;
        await session.send(resetMessage);
      }

      const usrid = `&usrid=${chat_id}`;
      const session_id = `&msg=${encodeURIComponent(
        userText
      )}${usrid}&source=glm-girlfriend`;

      const response = await ctx.http.get(apiAddress + userText + session_id, {
        responseType: "text",
      });

      // 如果该用户没有历史对话记录，则在 Map 对象中为该用户创建一条记录
      if (!conversation.has(session.uid)) {
        conversation.set(session.uid, new Map<string, string>());
      }
      // 获取该用户的对话记录
      const conv = conversation.get(session.uid);
      // 如果对话记录数量超过了设定的阈值，则删除最早的记录
      while (conv.size >= config.memoryShortLength) {
        conv.delete(conv.keys().next().value);
      }
      // 将当前消息内容和回复内容保存到该用户的对话记录中
      conv.set(session.content, response);

      // 返回回复内容
      return response;
    }
    // 如果不符合回复条件，则调用 next() 函数，将消息传递给下一个中间件处理
    return next();
  });
}
