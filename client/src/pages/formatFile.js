import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const formatFile = () => {
  const location = useLocation();

  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [remix, setRemix] = useState("Remix");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // extracts name from the url
  let { name } = useParams();

  // http://localhost:3000/FormatFile/name
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const res = await fetch(`http://localhost:8000/find/${name}`);
          const file = await res.json();
          setData(file);
          setTitle(file.file[1]);
          setMessage(file.show_file);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location.state]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // change message hook
  //   wait for the hook to change
  // send the message to the data to create own pastebin
  // send back because of the promiseHooks(await)
  // change url
  const changeData = async (message) => {
    try {
      const res = await fetch("http://localhost:8000/store_paste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (!res) {
        throw new Error("No response saved");
      }

      const msg = await res.json();
      return msg.name;
    } catch (error) {
      console.error(error);
    }
  };

  // how about instead /remix/:name renders a new component RemixPaste instead
  // RemixPaste checks the id when the page loads
  //and renders a textarea with the initial value of whatever the paste is

  // when the Remix Button is pressed
  // Navigates to the new component remixPaste.js
  // once it gets to the page, the text area is already open with the previous message inside
  // when the buttone is pressed the page renders to the new page ../{name}

  const handleClick = async (message, title) => {
    if (remix === "Remix") {
      window.location.href = `http://localhost:3000/remix/${title}`;
    }
    if (remix === "Save") {
      const newName = await changeData(message);
      window.history.pushState({}, "", `/${newName}`);
    }
  };

  return (
    <div>
      <div>
        <h1>TITLE:</h1>
        <h2>{title}</h2>
        <h1>TIMESTAMP:</h1>
        <h3>{data.file[3]}</h3>
        <h1>MESSAGE:</h1>
        {isEditing ? (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        ) : (
          <pre>{message}</pre>
        )}
      </div>
      <div>
        <button value={remix} onClick={() => handleClick(message, title)}>
          {remix}
        </button>
      </div>
    </div>
  );
};

export default formatFile;
