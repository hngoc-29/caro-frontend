import React from "react";

const Modal = ({ setModalOpen, handleConfirm }) => {
    const [inputCode, setInputCode] = React.useState("");
    React.useEffect(() => {
        document.title = 'Caro Game | Join Room';
        return () => document.title = 'Caro Game';
    }, []);

    return (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                <h2>Join Room</h2>
                <input
                    type="text"
                    placeholder="Enter room id..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="modal-input"
                />
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={() => setModalOpen(false)}>Hủy</button>
                    <button className="modal-btn confirm" onClick={() => handleConfirm(inputCode)}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
