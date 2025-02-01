import React from "react";

const Modal = ({ setModalOpen, handleConfirm }) => {
    const [inputCode, setInputCode] = React.useState("");
    //if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                <h2>Nhập thông tin</h2>
                <input
                    type="text"
                    placeholder="Nhập nội dung..."
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
