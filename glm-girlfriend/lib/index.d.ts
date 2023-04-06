import { Context, Schema } from "koishi";
export declare const name = "glm-girlfriend";
export declare const usage = "\n### \u7528\u524D\u9700\u77E5\n\n\u672C\u63D2\u4EF6\u57FA\u4E8ETomLBZ\u7684[openai](https://github.com/TomLBZ/koishi-plugin-openai)\u63D2\u4EF6\u8FDB\u884C\u5F00\u53D1\n\n\u673A\u5668\u6709\u4E09\u79CD\u60C5\u51B5\u4F1A\u56DE\u590D\u4F60\u7684\u5BF9\u8BDD\uFF1A\n1.\u88AB\u53EB\u5230\u540D\u5B57\uFF08botname\uFF09\n2.\u81EA\u5DF1\u88AB@\n3.\u968F\u673A\u56DE\u590D\uFF08randomReplyFrequency\uFF09\n### \u670D\u52A1\u5668\u5730\u5740\u683C\u5F0F\n\n\u5E94\u4E3Ahttps://\u670D\u52A1\u5668\u5730\u5740/chatglm?\"\n\n\u81EA\u5EFA\u540E\u7AEF\u90E8\u7F72chatglm\u540E\u9700\u8981\u5B89\u88C5\u914D\u5957\u7684api\u6587\u4EF6\uFF0C[openai](https://github.com/wochenlong/ChatGLM-6B-with-flask-api)\n\n";
export interface Config {
    apiAddress: string;
    botname: string;
    memoryShortLength: number;
    randomReplyFrequency: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
