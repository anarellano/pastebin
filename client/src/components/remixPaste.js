import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RemixPaste = () => {
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  let { name } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (name) {
          const res = await fetch(`http://localhost:8000/find/${name}`);

          if (!res) {
            setData(null);
            setTitle(null);
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
  }, [title]);

  if (!data) {
    return (
      <div>
        <h1>No paste data was found</h1>
      </div>
    );
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
        setError("Could not get remix paste data ");
      }
      setError(null);
      const msg = await res.json();
      return msg.name;
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const newName = await changeData(message);
    window.location.href = `http://localhost:3000/view/${newName}`;
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
        {error && <p style={{ color: "red", paddingTop: "7px" }}>{error}</p>}
      </div>
      <div>
        <button onClick={(e) => handleClick(e)}>Save</button>
      </div>
    </div>
  );
};

export default RemixPaste;
