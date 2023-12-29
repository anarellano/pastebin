import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import InputPaste from "./pages/inputPaste";
import FormatFile from "./pages/formatFile";
import Navbar from "./components/navbar";

function App() {
  const files = [
    { path: "/", element: <InputPaste /> },
    { path: "/view/:name", element: <FormatFile /> },
    { path: "/remix/:name", element: <FormatFile /> },
    // { path: "/History", element: <History /> },
  ];
  return (
    <Router>
      <Navbar />
      <Routes>
        {files.map((file, i) => (
          <Route key={i} path={file.path} element={file.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
