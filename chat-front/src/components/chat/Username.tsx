import { useState } from "react";
import { Socket } from "socket.io-client";
import { PrimeReactProvider } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
interface Props {
    socket: Socket;
    setUsername: (username: string) => void;
}

const Username = ({ socket, setUsername }: Props) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUsername(text);
        socket.emit("username-set", {
            username: text,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col m-2">
                <input type="text" placeholder="Firstname" value={text} onChange={(e) => setText(e.target.value)} className="input input-bordered input-sm w-full max-w-xs" />
                <button className="btn btn-primary btn-xs w-12 m-3">Select</button>
            </div>
        </form>
    );
};

export default Username;
