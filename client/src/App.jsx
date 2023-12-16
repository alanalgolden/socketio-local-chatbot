import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [instance, setInstance] = useState("");
  const [connectedInstance, setConnectedInstance] = useState("");
  const [chat, setChat] = useState([]);

  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };

  const onRoomUpdate = (e) => {
    setInstance(e.target.value);
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    setChat([...chat, message]);
    socket.emit("send-message", message, connectedInstance);
    setMessage("");
  };

  const onInstanceSubmit = (e) => {
    e.preventDefault();
    console.log(instance);
    socket.emit("join-instance", instance, (message) => {
      console.log(message);
    });
    console.log(`Connected to instance id: ${instance}`);
    setConnectedInstance(instance);
    setInstance("");
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setChat([...chat, message]);
      console.log(chat);
    });
  }, [chat]);

  return (
    <div>
      <h1>Chat</h1>
      <h3>Connected to instance: {connectedInstance}</h3>
      <form onSubmit={onMessageSubmit}>
        <input
          name="message"
          onChange={(e) => onMessageUpdate(e)}
          value={message}
          label="Message"
        />
        <button>Send Message</button>
      </form>
      <form onSubmit={onInstanceSubmit}>
        <input
          name="instance"
          onChange={(e) => onRoomUpdate(e)}
          value={instance}
          label="Instance"
        />
        <button>Join Instance</button>
      </form>
      <div>
        {chat.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
