import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IMessage } from "./Message";

interface Props {
    message: IMessage;
    isMe: boolean;
    socket: Socket;
}

const Translate = ({ message, isMe, socket }: Props) => {
    const languages = ["Français", "Anglais", "Allemand", "Italien", "Espagnol", "Chinois", "Arabe"];

    const handleTranslate = (msg: IMessage, language: string) => {
        socket.emit("message-translate", { msg, language });
    };
    return (
        <select className={isMe ? "select select-bordered select-xs float-right m-1" : "select select-bordered select-xs float-left m-1"} onChange={(e) => handleTranslate(message, e.target.value)}>
            <option disabled selected>
                Translate
            </option>
            {languages.map((language) => (
                <option value={language}>{language}</option>
            ))}
        </select>
    );
};

export default Translate;
