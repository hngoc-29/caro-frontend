import React from 'react'

export default function ModalEnd({ kq, setModalEnd, onBack }) {
    return (
        <div className='modalEnd-containner' onClick={() => {
            setModalEnd(false);
            onBack();
        }}>
            <div className='modalEnd-wapper' onClick={e => e.stopPropagation()}>
                <h2 className='modalEnd-title'>{kq}</h2>
            </div>
            <p className='modalEnd-closeTitle'>Ấn màn hinh để tiếp tục</p>
        </div>
    )
}
