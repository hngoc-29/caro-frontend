import { useState, useRef, useEffect } from 'react';
import ModalEnd from './ModalEnd';
import ModalChat from './ModalChat';

const Room = ({ roomNumber, player1, player2, onBack, ower, setOwer, you, socket, setStart }) => {
    const icon = useRef([`X`, `O`]);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [iconYou, setIconYou] = useState(null);
    const [iconPlayer1, setIconPlayer1] = useState(null);
    const [iconPlayer2, setIconPlayer2] = useState(null);
    const [iconCt, setIconCt] = useState(``);
    const [isXNext, setIsXNext] = useState(null);
    const [modalEnd, setModalEnd] = useState(false);
    const [kq, setKq] = useState(null);
    const [winner, setWinner] = useState(null);
    const [status, setStatus] = useState(``);
    const [boardSize, setBoardSize] = useState(80); // Kích thước ô cờ mặc định

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
                socket.emit(`check-kq`, { winner, roomId: roomNumber });
            }
        }
    }, [status])

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board)) return;
        const newBoard = board.slice();
        newBoard[index] = iconCt;
        socket.emit(`update-board`, {
            board: newBoard,
            isXNext: !isXNext,
            roomId: roomNumber
        });
    };

    const startGame = () => {
        if (player1 && player2) {
            socket.emit(`start-game`, roomNumber);
        }
    };

    useEffect(() => {
        socket.on(`start-game-success`, data => {
            setOwer(data.ower);
            setBoard(data.board);
            setIconPlayer1(icon.current[data.player1]);
            setIconPlayer2(icon.current[data.player1 ? 0 : 1]);
            setIsXNext(data.isXNext);
            setIconCt(icon.current[data.isXNext ? 1 : 0]);
        });

        socket.on(`update-board-success`, data => {
            setBoard(data.board);
            setIsXNext(data.isXNext);
            setIconCt(icon.current[data.isXNext ? 1 : 0]);
        });

        socket.on(`return-kq`, (kq) => {
            setModalEnd(true);
            setKq(kq);
        });

        return () => {
            socket.off(`start-game-success`);
            socket.off(`update-board-success`);
            socket.off(`return-kq`);
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
                <h2>Room Number: {roomNumber}</h2>
                <div className='playerStatus'>
                    <h3>Player 1: {player1} <span className="player-icon">{iconPlayer1}</span></h3>
                    <h3>Player 2: {player2} <span className="player-icon">{iconPlayer2}</span></h3>
                </div>
                {!ower && <div className="status">{status}</div>}
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
                    {ower === you ? <button
                        onClick={startGame}
                        disabled={!player1 || !player2}
                        style={{
                            backgroundColor: player1 && player2 ? 'blue' : 'gray',
                            cursor: player1 && player2 ? 'pointer' : 'not-allowed',
                            color: `white`
                        }}
                    >
                        Start Game
                    </button> : <span>Đang chờ chủ phòng bắt đầu</span>}
                </div>}
            </div>
            {modalEnd && <ModalEnd kq={kq} setModalEnd={setModalEnd} onBack={() => setStart(false)} />}
            <ModalChat room={roomNumber} socket={socket} you={you} />
        </div>
    );
};

export default Room;
