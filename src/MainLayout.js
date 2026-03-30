import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import useAutoLogout  from "./hooks/useAutoLogout";

function MainLayout({ onOpen }) {
  useAutoLogout();
  return (
    <>
      <Header onOpen={onOpen} />
      <Outlet />
      <Footer onOpen={onOpen}/>
    </>
  );
}

export default MainLayout;
