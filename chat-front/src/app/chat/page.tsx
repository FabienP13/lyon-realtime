"use client";
import { PrimeReactProvider } from "primereact/api";
import Messages from "@/components/chat/Messages";
import SendMessage from "@/components/chat/SendMessage";
import Username from "@/components/chat/Username";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/", {
    autoConnect: false,
});

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            console.log("connected", socket.id);
        });

        socket.on("messages-old", (data) => {
            setMessages((msg) => [msg, ...data] as any);
        });

        socket.on("chat-message", (data) => {
            setMessages((msg) => [...msg, data] as any);
        });
    }, []);

    return (
        <PrimeReactProvider>
            {username && (
                <h3>
                    <b> {username}</b> is connected.
                </h3>
            )}
            {!username && <Username socket={socket} setUsername={setUsername} />}
            <div className="card w-7/12 bg-neutral  text-primary-content m-auto">
                <div className="card-body w-100">
                    {username && <Messages socket={socket} messages={messages} username={username} />}
                    {username && <SendMessage socket={socket} username={username} messages={messages} />}
                </div>
            </div>
        </PrimeReactProvider>
    );
};

export default Chat;
