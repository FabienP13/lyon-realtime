import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import VerifyButton from "@/components/chat/VerifyButton";
import Translate from "@/components/chat/Translate";
import VerifiedInformation from "@/components/chat/VerifyInformation";
import dayjs from "dayjs";
export interface IMessage {
    username: string;
    content: string;
    timeSent: string;
}

interface Props {
    message: IMessage;
    isMe: boolean;
    socket: Socket;
}

const Message = ({ message, isMe, socket }: Props) => {
    return (
        <div className={`chat ${isMe ? "chat-end" : "chat-start"} flex flex-col `}>
            <div className={`flex flex-col  ${isMe ? "items-end" : "items-start"}`}>
                <div className="chat-header flex flex-col m-2">
                    <p>{message.username}</p>
                </div>
                <div className={`chat-bubble p-2 ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>{message.content}</div>
                <div className="chat-footer opacity-50">
                    <p className="text-xs opacity-50 ">
                        Envoyé le {dayjs(message.timeSent).format("DD/MM/YYYY")} à {dayjs(message.timeSent).format("HH:mm:ss")}
                    </p>
                </div>
                <div className="flex flex-row ">
                    <VerifyButton message={message} socket={socket} />
                    <Translate message={message} socket={socket} isMe={isMe} />
                </div>
            </div>
            <VerifiedInformation message={message} socket={socket} isMe={isMe} />
        </div>
    );
};

export default Message;
