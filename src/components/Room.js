import { useState, useRef, useEffect } from 'react';
import ModalEnd from './ModalEnd';
import ModalChat from './ModalChat';
import CopyButton from './CopyButton';

const Room = ({ roomNumber, player1, player2, onBack, ower, setOwer, you, socket, setStart }) => {
    const icon = useRef(['X', 'O']);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [iconYou, setIconYou] = useState(null);
    const [iconPlayer1, setIconPlayer1] = useState(null);
    const [iconPlayer2, setIconPlayer2] = useState(null);
    const [iconCt, setIconCt] = useState('');
    const [isXNext, setIsXNext] = useState(null);
    const [modalEnd, setModalEnd] = useState(false);
    const [kq, setKq] = useState(null);
    const [winner, setWinner] = useState(null);
    const [status, setStatus] = useState('');
    const [timeLeft, setTimeLeft] = useState(10);
    const [boardSize, setBoardSize] = useState(80); // Kích thước ô cờ mặc định
    const timerRef = useRef(null);
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < 600) {
                setBoardSize(60); // Nhỏ hơn khi màn hình nhỏ
            } else {
                setBoardSize(80);
            }
        };

        window.addEventListener("resize", updateSize);
        updateSize(); // Gọi ngay lần đầu tiên

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        timeLeftRef.current = timeLeft; // Cập nhật giá trị ref mỗi khi timeLeft thay đổi
    }, [timeLeft]);

    useEffect(() => {
        if (iconYou === iconCt) {

            // Xóa timer cũ nếu có
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                if (timeLeftRef.current <= 1) {
                    clearInterval(timerRef.current);
                    const newBoard = board.slice();
                    const winner = calculateWinner(newBoard);
                    if (!winner) {
                        socket.emit('update-board', {
                            board: newBoard,
                            isXNext: !isXNext,
                            roomId: roomNumber,
                        });
                    }
                } else {
                    socket.emit('update-time', { time: timeLeftRef.current - 1, roomId: roomNumber });
                }
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [iconYou, iconCt]);

    useEffect(() => {
        if (iconPlayer1 !== null && iconPlayer2 !== null) {
            setIconYou(player1 === you ? iconPlayer1 : iconPlayer2);
        }
    }, [iconPlayer1, iconPlayer2, player1, you]);

    useEffect(() => {
        if (!ower) startGame();
    }, []);

    useEffect(() => {
        if (winner) {
            if (you === player1) {
                socket.emit('check-kq', { winner, roomId: roomNumber });
            }
        }
    }, [status]);

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board)) return;
        const newBoard = board.slice();
        newBoard[index] = iconCt;
        socket.emit('update-board', {
            board: newBoard,
            isXNext: !isXNext,
            roomId: roomNumber,
            isPlayer1: you === player1 ? true : false,
        });
    };

    const startGame = () => {
        if (player1 && player2) {
            socket.emit('start-game', roomNumber);
        }
    };

    useEffect(() => {
        socket.on('start-game-success', data => {
            setOwer(data.ower);
            setBoard(data.board);
            setIconPlayer1(icon.current[data.player1]);
            setIconPlayer2(icon.current[data.player1 ? 0 : 1]);
            setIsXNext(data.isXNext);
            setIconCt(icon.current[data.isXNext ? 1 : 0]);
            setTimeLeft(data.time);
        });

        socket.on('update-board-success', data => {
            setBoard(data.board);
            setIsXNext(data.isXNext);
            setIconCt(icon.current[data.isXNext ? 1 : 0]);
            setTimeLeft(data.timeLeft);
        });

        socket.on("update-time-noti", (time) => {
            setTimeLeft(time);
            timeLeftRef.current = time; // Cập nhật ref để đảm bảo đồng bộ
        });

        socket.on('return-kq', (kq) => {
            setModalEnd(true);
            setKq(kq);
        });

        return () => {
            socket.off('start-game-success');
            socket.off('update-board-success');
            socket.off('return-kq');
            socket.off('update-time-noti');
        };
    }, [socket]);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    useEffect(() => {
        setWinner(calculateWinner(board));
        setStatus(winner ? `Winner: ${winner}` : `Next player: ${iconCt}`);
    });

    return (
        <div className='room-wrapper'>
            <button className="back-button" onClick={onBack}>← Quay lại</button>
            <div className="room-container">
                <h2>Room Number: {roomNumber}<CopyButton text={roomNumber} /></h2>
                <div className='playerStatus'>
                    <h3 style={{ position: 'relative' }}>
                        <span className={iconCt === iconPlayer1 ? 'allow statusPl' : 'noAllow statusPl'}></span>
                        {player1}
                        <span className="player-icon">{iconPlayer1}{player1 === you &&
                            <span style={{ color: 'black' }}>(YOU)</span>}</span>
                    </h3>
                    <h3 style={{ position: 'relative' }}>
                        <span className={iconCt === iconPlayer2 ? 'allow statusPl' : 'noAllow statusPl'}></span>
                        {player2}
                        <span className="player-icon">{iconPlayer2}{player2 === you &&
                            <span style={{ color: 'black' }}>(YOU)</span>}</span>
                    </h3>
                </div>
                {!ower && <div className="status">
                    {status} <br />
                    {<span>Thời gian: {timeLeft}s</span>}
                </div>}
                {!ower ? <div className="board">
                    {board.map((value, index) => (
                        <button
                            key={index}
                            disabled={!(iconCt === iconYou)}
                            className="square"
                            style={{ width: `${boardSize}px`, height: `${boardSize}px` }}
                            onClick={() => handleClick(index)}
                        >
                            {value}
                        </button>
                    ))}
                </div> : <div>
                    {ower === you ?
                        <button
                            onClick={startGame}
                            disabled={!player1 || !player2}
                            className={`start-game-btn ${player1 && player2 ? 'active' : 'disabled'}`}
                        >
                            Start Game
                        </button>
                        : <span className="waiting-message">Đang chờ chủ phòng bắt đầu</span>
                    }
                </div>}
            </div>
            {modalEnd && <ModalEnd kq={kq} setModalEnd={setModalEnd} onBack={() => setStart(false)} />}
            <ModalChat room={roomNumber} socket={socket} you={you} />
        </div>
    );
};

export default Room;