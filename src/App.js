import { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import Home from './Components/Home';
import SignIn from './Components/SIgnInPopup';
import RegisterPopup from './Components/RegisterPopup'




function App() {
  const [authView, setAuthView] = useState(null);
  // authView: null | "login" | "register"

  return (
    <div>
      <Header onOpen={() => setAuthView("login")} />

      <Home />

      {authView === "login" && (
        <SignIn
          onClose={() => setAuthView(null)}
          onOpenRegister={() => setAuthView("register")}
        />
      )}

      {authView === "register" && (
        <RegisterPopup
          onClose={() => setAuthView(null)}
          onOpenSignIn={() => setAuthView("login")}
        />
      )}
    </div>
  );
}

export default App;
