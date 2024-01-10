import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import History from "../components/history.js";

function InputPaste() {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/store_paste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: data }),
      });

      if (!res) {
        throw new Error("No response saved");
      }

      const msg = await res.json();
      const name = msg.name;
      setData("");
      navigate("/FormatFile", { state: { name } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="">
        <div className="row">
          <div className="col">
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              cols={50}
              rows={10}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>

          <div className="col">
            <History />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputPaste;
