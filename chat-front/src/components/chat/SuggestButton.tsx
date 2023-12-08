import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";

interface Props {
    socket: Socket;
    messages: IMessage[];
    loading: boolean;
    setLoading(value: boolean): void;
}

const SuggestButton = ({ messages, socket, loading, setLoading }: Props) => {
    const suggestMessage = (e: any) => {
        e.preventDefault();
        let messagesDatas: any[] = [];
        messages.map((message) => {
            if (message.username != undefined) {
                messagesDatas.push(message.content);
            }
        });
        setLoading(true);
        socket.emit("suggest-message", messagesDatas);
    };
    return (
        <button
            className="btn btn-outline btn-warning btn-xs w-16 m-3"
            onClick={(e) => {
                suggestMessage(e);
            }}
        >
            Suggest
        </button>
    );
};
export default SuggestButton;
