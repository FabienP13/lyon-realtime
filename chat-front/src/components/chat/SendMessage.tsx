"use client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";
import SuggestButton from "@/components/chat/SuggestButton";
import SuggestedInformations from "@/components/chat/SuggestedInformations";
interface Props {
    socket: Socket;
    username: string;
    messages: IMessage[];
}

const SendMessage = ({ socket, username, messages }: Props) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (text.trim() !== "") {
            socket.emit("chat-message", {
                username,
                content: text,
                timeSent: new Date().toISOString(),
            });
            setText("");
        }
    };

    return (
        <div className="m-auto w-full">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col m-2">
                    <textarea placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} className="textarea textarea-bordered w-full" />
                    <div className="m-auto">
                        <button className="btn btn-outline btn-primary btn-xs w-12 m-3" type="submit">
                            Send
                        </button>
                        <SuggestButton socket={socket} messages={messages} />
                    </div>
                    <SuggestedInformations socket={socket} username={username} />
                </div>
            </form>
        </div>
    );
};

export default SendMessage;
