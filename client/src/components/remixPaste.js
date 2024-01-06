import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// how about instead /remix/:name renders a new component RemixPaste instead
// RemixPaste checks the id when the page loads
//and renders a textarea with the initial value of whatever the paste is

// when the Remix Button is pressed
// Navigates to the new component remixPaste.js
// make context page that passes in the data, so youre able to pass it on
// once it gets to the page, the text area is already open with the previous message inside
// when the buttone is pressed the page renders to the new page ../{name}

const RemixPaste = () => {
  // const location = useLocation();

  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [remix, setRemix] = useState("Save");
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
  }, [title]);

  if (!data) {
    return <div>Loading...</div>;
  }

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
      console.log("Return Message:", msg);
      return msg.name;
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async (message, title) => {
    if (remix === "Remix") {
      window.location.href = `http://localhost:3000/remix/${title}`;
    }
    if (remix === "Save") {
      const newName = await changeData(message);
      // window.history.pushState({}, "", `/view/${newName}`);
      window.location.href = `http://localhost:3000/view/${newName}`;
      setIsEditing(true);
      setRemix("Remix");
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
          <pre>{message}</pre>
        ) : (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
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

export default RemixPaste;
