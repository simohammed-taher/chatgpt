import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const creatNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...previousChats,
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
        ]
      ))
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChats) => previousChats.title)));

  console.log(uniqueTitles);
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={creatNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) =>
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          )}
        </ul>
        <nav>
          <p>Made by Taher</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>OFPPT-GPT-4</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) =>
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          )}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} placeholder="Send a message" onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                e.keyCode === 13 && e.shiftKey === false && getMessages();
              }}
            />
            <div id="submit" onClick={getMessages} className="subb">
              {/* ➢ */}
              <img
                src="./send.png"
                width={15}
                alt="send-button"
                className="absolute top-4 right-3 hover:cursor-pointer ease-in duration-100 hover:scale-125"
              />
            </div>
          </div>
          <p className="info">
            ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT Mar 23 Version
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;


