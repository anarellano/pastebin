import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const History = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/history_component`);
        if (!res) {
          throw new Error("No data");
        }
        const data = await res.json();
        console.log(data);
        setList(data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  //shows how long the file has been created in min
  const time = (dateCreted) => {
    const curentTime = new Date();
    const timeCreated = new Date(dateCreted);
    const timeElapsed = curentTime - timeCreated;

    const min = Math.floor(timeElapsed / 60000);

    return min + " min ago";
  };
  return (
    <div>
      {list.map((item, i) => {
        return (
          <div key={i}>
            <a href={`/view/${item.name}`} target="_blank">
              {item.name}
            </a>
            <p>{time(item.date)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default History;
