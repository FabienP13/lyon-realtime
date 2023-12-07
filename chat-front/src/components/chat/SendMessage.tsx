"use client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";

interface Props {
    socket: Socket;
    username: string;
    messages: IMessage[];
}

const SendMessage = ({ socket, username, messages }: Props) => {
    const [text, setText] = useState("");
    const [suggestedMessages, setSuggestedMessages] = useState([]);

    useEffect(() => {
        socket.on("suggested-message", (data: any) => {
            setSuggestedMessages(JSON.parse(data).suggestions);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("chat-message", {
            username,
            content: text,
            timeSent: new Date().toISOString(),
        });

        setText("");
    };
    const sendSuggestedMessage = (e: any, suggestion: string) => {
        e.preventDefault();
        socket.emit("chat-message", {
            username,
            content: suggestion,
            timeSent: new Date().toISOString(),
        });
        setText("");
        setSuggestedMessages([]);
    };
    const suggestMessage = (e: any) => {
        e.preventDefault();
        let messagesDatas: any[] = [];
        messages.map((message) => {
            if (message.username != undefined) {
                messagesDatas.push(message.content);
            }
        });

        socket.emit("suggest-message", messagesDatas);
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col m-2">
                <input type="text" placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} className="input input-bordered input-sm w-full max-w-xs" />
                <div>
                    <button className="btn btn-outline btn-primary btn-xs w-12 m-3" type="submit">
                        Send
                    </button>
                    <button
                        className="btn btn-outline btn-warning btn-xs w-16 m-3"
                        onClick={(e) => {
                            suggestMessage(e);
                        }}
                    >
                        Suggest
                    </button>
                </div>
                <div>
                    {suggestedMessages.map((suggestion) => {
                        return (
                            <button className="btn btn-primary btn-xs m-1" onClick={(e) => sendSuggestedMessage(e, suggestion)}>
                                {suggestion}
                            </button>
                        );
                    })}
                </div>
            </div>
        </form>
    );
};

export default SendMessage;
