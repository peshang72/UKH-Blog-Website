import { useState } from "react";
import Landing from "./pages/Landing";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Landing />
    </div>
  );
}

export default App;
