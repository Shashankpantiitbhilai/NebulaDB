import { useState } from "react";

import "./App.css";
import NebulaDBUI from "./components/Home";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NebulaDBUI />
    </>
  );
}

export default App;
