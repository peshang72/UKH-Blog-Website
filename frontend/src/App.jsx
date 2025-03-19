import { useState } from "react";
import Landing from "./pages/Landing";
import BrowseBlogs from "./pages/BrowseBlogs";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <Landing /> */}
      
      <BrowseBlogs />
    </div>
  );
}

export default App;
