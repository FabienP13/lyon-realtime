import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";

interface Props {
    socket: Socket;
    message: IMessage;
}

const VerifyButton = ({ message, socket }: Props) => {
    const verifyMessage = () => {
        socket.emit("message-verify", { message });
    };
    return (
        <button className={`btn btn-outline btn-xs m-1`} onClick={verifyMessage}>
            Verify
        </button>
    );
};

export default VerifyButton;
