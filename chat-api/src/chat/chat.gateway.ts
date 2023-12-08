import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import OpenAI from 'openai';
interface IMessage {
  username: string;
  content: string;
  timeSent: string;
}
const openai = new OpenAI({
  apiKey: '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',
});

async function TranslateMessage(message: IMessage, language: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `you are a professionnal translator, you only translate my message in ${language}`,
      },
      { role: 'user', content: ` Translate this : ${message.content}` },
    ],
  });

  return response.choices[0].message.content;
}

async function verifyInformation(message: IMessage) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You know a lot of things, please tell me if the information is true or not. If it's true, just answer me this response : 'true'. If it's false, tell me the truth. If the information can't be verified, just answer this : "This information is not verifiable""`,
      },
      { role: 'user', content: ` Verify this : ${message.content}` },
    ],
  });

  return response.choices[0].message.content;
}
async function suggestMessage(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `I will give you a array of message, it's a conversation ordered by date. Suggest me a list of 3 possible answer. Give me this 3 possibles answer in JSON format with "suggestion" as attribute `,
      },
      { role: 'user', content: ` This is the array : ${message}` },
    ],
  });

  return response.choices[0].message.content;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  clients: { client: Socket; username?: string }[] = [];
  chatMessages: IMessage[] = [];

  @SubscribeMessage('message-translate')
  async handleTranslateMessage(client: Socket, payload: any) {
    let currentMessage = this.chatMessages.find(
      (message: IMessage) => message.timeSent === payload.msg.timeSent,
    );
    const currentMessageIndex = this.chatMessages.findIndex(
      (msg: IMessage) => msg === currentMessage,
    );

    let messageTranslated = await TranslateMessage(
      payload.msg,
      payload.language,
    );
    if (currentMessage) {
      currentMessage.content = messageTranslated;
    }
    if (currentMessageIndex != -1) {
      this.chatMessages.splice(currentMessageIndex, 1, currentMessage);
    }

    this.server.emit('messages-old', this.chatMessages);
  }

  @SubscribeMessage('message-verify')
  async verifyingMessage(client: any, payload: any) {
    let verifiedInformation = await verifyInformation(payload.message);
    this.server.emit('verified-message', {
      verifiedInformation,
      message: payload.message,
    });
  }
  @SubscribeMessage('suggest-message')
  async suggestionMessage(client: any, payload: any) {
    let messagesSuggested = await suggestMessage(payload);

    client.emit('suggested-message', messagesSuggested);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', payload.message.content);
    return 'Hello world!';
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(client: any, payload: IMessage): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c.username) {
      this.server.emit('chat-message', {
        ...payload,
        username: c.username,
      });
      this.chatMessages.push({
        ...payload,
        username: c.username,
      });
    }
  }

  @SubscribeMessage('username-set')
  handleUsernameSet(client: any, payload: any): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c) {
      c.username = payload.username;
    }
  }

  handleConnection(client: Socket) {
    console.log('client connected ', client.id);
    this.clients.push({
      client,
    });
    client.emit('messages-old', this.chatMessages);
  }

  handleDisconnect(client: any) {
    console.log('client disconnected ', client.id);
    this.clients = this.clients.filter((c) => c.client.id !== client.id);
  }
}
