import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Room from './components/Room';
import WaitModal from "./components/Wait";
import Modal from './components/Modal';
import './App.css';

function App() {
  const [inputName, setInputName] = useState(localStorage.getItem(`username`) ?? ``);
  const [room, setRoom] = useState({});
  const [find, setFind] = useState(false);
  const [start, setStart] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [ower, setOwer] = useState(null);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io('https://caro-backend.onrender.com');

    socket.current.on(`find-player-wait`, () => {
      setFind(true);
    })

    socket.current.on(`join-success`, (ower) => setOwer(ower));

    socket.current.on(`find-player-success`, (room) => {
      setOwer(room.ower);
      setModalOpen(false);
      setFind(false);
      setStart(true);
      setRoom(room);
    });

    socket.current.on(`room-created`, (data) => {
      setFind(false);
      setStart(true);
      setOwer(data.ower);
      setRoom({
        ...data,
        player2: ``
      });
    });

    socket.current.on(`error`, mes => {
      toast.error(mes);
      setStart(false);
    });

    return () => {
      socket.current.off(`find-player-wait`);
      socket.current.off(`join-success`);
      socket.current.off(`find-player-success`);
      socket.current.off(`room-created`);
      socket.current.off(`error`);
    }

  }, []);
  const ghepngaunhien = () => {
    localStorage.setItem(`username`, inputName);
    socket.current.emit(`find-player`, inputName);
  }
  const huyFind = () => {
    setFind(false);
    localStorage.setItem(`username`, inputName);
    socket.current.emit(`close-wait`);
  }
  const createRoom = () => {
    localStorage.setItem(`username`, inputName);
    socket.current.emit(`create-room`, inputName);
  }
  const handleConfirm = (input) => {
    localStorage.setItem(`username`, inputName);
    socket.current.emit(`join-room`, { username: inputName, roomId: input });
  };
  const outRoom = () => {
    socket.current.emit(`out-room`, inputName);
  }
  return (
    <div className="App">
      {start ? <Room
        ower={ower}
        setOwer={setOwer}
        roomNumber={room.roomId}
        player1={room.player1}
        player2={room.player2}
        onBack={outRoom}
        you={inputName}
        socket={socket.current}
        setStart={setStart}
      /> : <>
        {!find ? <div className="page-1">
          <input onChange={(e) => setInputName(e.target.value)} value={inputName} type="text" id="nameinput"
            className="input-field" />
          <a onClick={ghepngaunhien} className="btn" href="#">Ghép ngẫu nhiên</a>
          <a onClick={createRoom} className="btn" href="#">Tạo phòng</a>
          <a onClick={() => setModalOpen(true)} className="btn" href="#">Tham gia</a>
        </div> : <>
          <WaitModal huyFind={huyFind} />
        </>}
      </>
      }
      {
        isModalOpen && <Modal
          setModalOpen={setModalOpen}
          handleConfirm={handleConfirm}
        />
      }
    </div >
  );
}

export default App;
