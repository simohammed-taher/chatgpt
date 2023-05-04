import { useEffect, useState } from "react";

function App() {
  const [userInput, setUserInput] = useState(null);
  const [generatedMessage, setGeneratedMessage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatTitle, setCurrentChatTitle] = useState(null);

  // Create a new chat
  const createNewChat = () => {
    setGeneratedMessage(null);
    setUserInput("");
    setCurrentChatTitle(null);
  };

  // Handle clicking on a chat title in the history
  const handleChatTitleClick = (uniqueTitle) => {
    setCurrentChatTitle(uniqueTitle);
    setGeneratedMessage(null);
    setUserInput("");
  };

  // Fetch messages from the API
  const fetchMessages = async () => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ message: userInput }),
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch("http://localhost:8000/completions", requestOptions);
      const data = await response.json();
      setGeneratedMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  // Update chat history when a new message is generated
  useEffect(() => {
    if (!currentChatTitle && userInput && generatedMessage) {
      setCurrentChatTitle(userInput);
    }

    if (currentChatTitle && userInput && generatedMessage) {
      setChatHistory((prevChats) => [
        ...prevChats,
        { title: currentChatTitle, role: "user", content: userInput },
        { title: currentChatTitle, role: generatedMessage.role, content: generatedMessage.content },
      ]);
    }
  }, [generatedMessage, currentChatTitle]);

  const currentChat = chatHistory.filter((chat) => chat.title === currentChatTitle);
  const uniqueChatTitles = Array.from(new Set(chatHistory.map((chat) => chat.title)));

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueChatTitles?.map((title, index) => (
            <li key={index} onClick={() => handleChatTitleClick(title)}>
              {title}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by XMehdi01</p>
        </nav>
      </section>
      <section className="main">
        {!currentChatTitle && <h1>Prodware-GPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={userInput}
              placeholder="Send a message"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                e.keyCode === 13 && e.shiftKey === false && fetchMessages();
              }}
            />
            <div id="submit" onClick={fetchMessages} className="subb">
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