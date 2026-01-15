import Header from "./Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";

function MainLayout({ onOpen }) {
  return (
    <>
      <Header onOpen={onOpen} />
      <Outlet />
      <Footer onOpen={onOpen}/>
    </>
  );
}

export default MainLayout;
