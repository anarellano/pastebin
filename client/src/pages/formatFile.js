import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const formatFile = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
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
  return (
    <div>
      <div>
        <h2>{data.file[1]}</h2>
        <h3>{data.file[3]}</h3>
        <pre className="block">{data.show_file}</pre>
      </div>
    </div>
  );
};

export default formatFile;
