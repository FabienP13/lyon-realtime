import Message, { IMessage } from "./Message";
import { Socket } from "socket.io-client";
interface Props {
    messages: IMessage[];
    username: string;
    socket: Socket;
}

const Messages = ({ messages, username, socket }: Props) => {
    return (
        <div>
            {messages.map(
                (msg) =>
                    msg.content !== null && (
                        <div key={msg.timeSent}>
                            <Message message={msg} isMe={msg.username === username} socket={socket} />
                        </div>
                    )
            )}
        </div>
    );
};

export default Messages;
