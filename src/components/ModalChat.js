import { useState, useEffect } from "react";

export default function ChatRoom({ socket, room, you }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [announcement, setAnnouncement] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/tắt chat

    useEffect(() => {
        socket.on("receive_message", (message) => {
            setMessages((prev) => [...prev, message]);
            setAnnouncement(true);  // Đặt trạng thái announcement thành true khi có tin nhắn
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);
    const sendMessage = () => {
        if (input.trim()) {
            const message = { text: input, sender: you, timestamp: new Date() };
            socket.emit("send_message", { room, message });
            setInput("");
        }
    };

    return (
        <div className={`chat-wrapper ${isOpen ? "open" : "closed"}`}>
            {/* Nút bật/tắt chat */}
            <button className="chat-toggle" onClick={() => { setIsOpen(!isOpen); setAnnouncement(false) }}>
                {isOpen ? "❌" : <>
                    💬
                    {announcement && <span className="chat-status"></span>}
                </>}
            </button>

            {isOpen && (
                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message">
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            )}
        </div>
    );
}
