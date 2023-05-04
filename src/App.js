
import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (title) => {
    setCurrentTitle(title);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      setValue("");
      const response = await fetch("http://localhost:8000/completions", options);

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessage(data.choices[0].message);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message]);

  const currentChat = previousChats.filter(
    (chat) => chat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((chat) => chat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat} className="btnchat">+ New chat</button>
        <ul className="history">
          {uniqueTitles && uniqueTitles.map((title, index) => (
            <li key={index} onClick={() => handleClick(title)}>
              {title}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by XM01</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>Prodware-GPT</h1>}
        <ul className="feed">
          {currentChat && currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              placeholder="Send a message"
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages} className="subb">
              ➢
            </div>
          </div>
          <p className="info">
            ChatGPT may produce inaccurate information about people, places, or
            facts. ChatGPT Mar 23 Version
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;

