import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// - When button is pressed make the message editable
//   - the input should have the the exsisting messages, tittles
// - after editting, you are able to press the save button and new pastebin is created
// - url should be "/remix/{name}"

const formatFile = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [remix, setRemix] = useState("Remix");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // extracts name from the url
  let { name } = useParams();

  // http://localhost:3000/FormatFile/name
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const res = await fetch(`http://localhost:8000/find/${name}`);
          const file = await res.json();
          console.log(file);
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
    console.log("message", message);
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

  const handleClick = async (message) => {
    console.log("message passed:", message);
    if (remix === "Remix") {
      window.history.pushState({}, "", `/remix/${title}`);
      setIsEditing(true);
      setRemix("Save");
    }
    if (remix === "Save") {
      const newName = await changeData(message);
      console.log("New Name", newName);
      window.history.pushState({}, "", `/${newName}`);
      setIsEditing(false);
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
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        ) : (
          <pre>{message}</pre>
        )}
      </div>
      <div>
        <button value={remix} onClick={() => handleClick(message)}>
          {remix}
        </button>
      </div>
    </div>
  );
};

export default formatFile;
