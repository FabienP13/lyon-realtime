import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";

interface Props {
    message: IMessage;
    isMe: boolean;
    socket: Socket;
}

const VerifiedInformation = ({ message, isMe, socket }: Props) => {
    const [verifiedInformation, setVerifiedInformation] = useState("");

    useEffect(() => {
        socket.on("verified-message", (data: any) => {
            if (data.message.timeSent === message.timeSent) {
                setVerifiedInformation(data.verifiedInformation);
            }
        });
    }, []);

    return (
        <div>
            {verifiedInformation && (
                <div className={`chat chat-bubble ${isMe ? "chat-end" : "chat-start"} ${verifiedInformation.includes("False") ? "chat-bubble-error" : "chat-bubble-success"}  `}>
                    <p>{verifiedInformation}</p>
                </div>
            )}
        </div>
    );
};

export default VerifiedInformation;
