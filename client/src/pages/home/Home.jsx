import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/side_navbar/Sidebar";
import MobileSidebar from "../../components/side_navbar/MobileSidebar";
import "./home.css";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 769px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    isTabletOrMobile && setIsSidebarOpen(false);
  }, [isTabletOrMobile]);
  return (
    <>
      <div className="homeContainer">
        <Topbar />
        <div className={`homeContainerWrapper`}>
          <div className="sidebarContainer">
            {isTabletOrMobile && <MobileSidebar />}
            {isBigScreen && (
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            )}
          </div>
          <div
            className={`homeContainerInnerWrapper  ${
              isTabletOrMobile && "homeContainerWrapperMobile"
            } ${isSidebarOpen && "homeContainerSlide"}`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
