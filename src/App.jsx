import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:8000'; 

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleMoveToWrite = () => {
    if (socket) {
      socket.emit('moveToWrite', {
        deviceType: 'Card_Cmd',
        command: 14,
      });
    }
  };

  const handleReject = () => {
    if (socket) {
      socket.emit('eject', {
        deviceType: 'Card_Cmd',
        command: 16,
      });
    }
  };


  return (
    <div className="App">
        <div className="button-container">
          <button onClick={handleMoveToWrite}>Move to Write</button>
          <button onClick={handleReject}>Reject</button>
        </div>
        <div className="messages-container">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
    </div>
  );
}

export default App;
