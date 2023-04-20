# glm-girlfriend

glm-girlfriend 是基于语言模型 ChatGLM 打造的一个虚拟女友，是 [Koishi](https://github.com/koishijs) 的一个插件。

## 安装

在 Koishi 插件市场中安装并启用 glm-girlfriend 插件。

## 使用

glm-girlfriend 插件会根据用户的输入进行对话，有三种情况会触发对话：

1. 当用户输入的内容中包含机器人的名字时，机器人会回复用户。
2. 当用户使用 "@机器人" 的形式呼叫机器人时，机器人会回复用户。
3. 当机器人觉得需要随机回复用户时，机器人会回复用户。

输入 "重置对话" 或 "清除记忆" 可以清除机器人的记忆。

## ChatGLM

ChatGLM 是一个基于 GPT 的中文对话生成语言模型，[点击这里](https://github.com/THUDM/ChatGLM-6B) 查看其 Github 仓库。

### 更新日志：

0.6.2：修复了source参数没有发送的错误，不会再显示“无来源的请求，请更新插件”

1.7.0：支持语音输出和加载猫娘

1.7.2：增加了文字和语音一起发送的功能

## 许可证

MIT
