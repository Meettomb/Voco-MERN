import Header from "./Components/Header";
import { Outlet } from "react-router-dom";

function MainLayout({ onOpen }) {
  return (
    <>
      <Header onOpen={onOpen} />
      <Outlet />
    </>
  );
}

export default MainLayout;
