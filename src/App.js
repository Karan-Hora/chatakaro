
import { Home } from "./Pages/Home";
import { ChatPage } from "./Pages/ChatPage";
import { Route, Routes } from "react-router-dom";




function App() {
  
 

  return (
     

    
    <div className=" bg-custom-image h-screen flex bg-cover bg-center  ">
     

      <Routes>
      <Route path="/" element={<Home />}  />
      <Route path="/chat" element={<ChatPage />}  />


      
      </Routes>
    </div>
  
  );
}

export default App;
