import React from 'react'

export default function Wait({ huyFind }) {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        const countUp = setInterval(() => {
            setCount(prev => prev + 1);
        }, 1000);
        return () => {
            clearInterval(countUp);
        }
    }, []);

    React.useEffect(() => {
        document.title = 'Caro Game | Match players';
        return () => document.title = 'Caro Game';
    }, []);
    return (
        <div className='waitModal'>
            <h2 className='titleFind'>Đang tìm người chơi</h2>
            <span className='countSec'>{count}</span>
            <button onClick={huyFind} className='waitBtnBack'>Hủy bỏ</button>
        </div>
    )
}
