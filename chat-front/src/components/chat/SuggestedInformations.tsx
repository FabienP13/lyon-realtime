import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
    socket: Socket;
    username: string;
}

const SuggestedInformations = ({ username, socket }: Props) => {
    const [suggestedMessages, setSuggestedMessages] = useState([]);

    useEffect(() => {
        socket.on("suggested-message", (data: any) => {
            setSuggestedMessages(JSON.parse(data).suggestions);
        });
    }, []);
    const sendSuggestedMessage = (e: any, suggestion: string) => {
        e.preventDefault();

        socket.emit("chat-message", {
            username,
            content: suggestion,
            timeSent: new Date().toISOString(),
        });

        setSuggestedMessages([]);
    };

    const closeSuggestions = () => {
        setSuggestedMessages([]);
    };
    return (
        <div className="m-auto flex items-center">
            {suggestedMessages.map((suggestion) => {
                return (
                    <button className="btn btn-primary btn-xs m-1" onClick={(e) => sendSuggestedMessage(e, suggestion)}>
                        {suggestion}
                    </button>
                );
            })}

            {suggestedMessages.length === 3 && (
                <button className="btn btn-circle btn-outline btn-xs btn-error" onClick={closeSuggestions}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SuggestedInformations;
