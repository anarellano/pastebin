import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const formatFile = () => {
  const location = useLocation();

  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // extracts name from the url
  let { name } = useParams();

  // http://localhost:3000/FormatFile/name
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const res = await fetch(`http://localhost:8000/find/${name}`);

          if (!res) {
            throw new Error("Fetch failed");
          }
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
    return (
      <div>
        <h1>No paste data was found</h1>
      </div>
    );
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

  const handleClick = async (title) => {
    window.location.href = `http://localhost:3000/remix/${title}`;
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
        {error && <p style={{ color: "red", paddingTop: "7px" }}>{error}</p>}
      </div>
      <div>
        <button onClick={() => handleClick(title)}>Remix</button>
      </div>
    </div>
  );
};

export default formatFile;
