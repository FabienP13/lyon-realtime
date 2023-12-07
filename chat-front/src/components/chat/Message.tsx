import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
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
    const languages = ["Français", "Anglais", "Allemand", "Italien", "Espagnol", "Chinois", "Arabe"];
    const [verifiedInformation, setVerifiedInformation] = useState("");

    const verifyMessage = () => {
        socket.emit("message-verify", { message });
    };
    const handleTranslate = (msg: IMessage, language: string) => {
        socket.emit("message-translate", { msg, language });
    };

    useEffect(() => {
        socket.on("verified-message", (data: any) => {
            if (data.message.timeSent === message.timeSent) {
                setVerifiedInformation(data.verifiedInformation);
            }
        });
    }, []);

    return (
        <div className={`chat ${isMe ? "chat-end" : "chat-start"} flex flex-col m-2`}>
            <div className="chat-header flex flex-col">
                <p>{message.username}</p>
                <p className="text-xs opacity-50">{message.timeSent}</p>
            </div>
            <div className="flex flex-col">
                <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>{message.content}</div>
                <div className="flex flex-row ">
                    <button className={`btn btn-outline btn-xs m-1`} onClick={verifyMessage}>
                        Verify
                    </button>
                    <select
                        className={isMe ? "select select-bordered select-xs float-right m-1" : "select select-bordered select-xs float-left m-1"}
                        onChange={(e) => handleTranslate(message, e.target.value)}
                    >
                        <option disabled selected>
                            Translate
                        </option>
                        {languages.map((language) => (
                            <option value={language}>{language}</option>
                        ))}
                    </select>
                </div>
            </div>
            {verifiedInformation && (
                <div className={`chat chat-bubble ${isMe ? "chat-end" : "chat-start"} ${verifiedInformation.includes("False") ? "chat-bubble-error" : "chat-bubble-success"}  `}>
                    <p>{verifiedInformation}</p>
                </div>
            )}
        </div>
    );
};

export default Message;
