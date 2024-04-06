import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { IoHomeOutline } from "react-icons/io5";
import { PiChats } from "react-icons/pi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import AnimatedCross from "../side_navbar/AnimatedCross";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ColorContext";
import { logoutCall } from "../../apiCalls";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [selected, setSelected] = useState(() => {
    const storedSelected = sessionStorage.getItem("selectedItem");
    return storedSelected || "Home";
  });

  const highlightedContentRef = useRef(null);
  // const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    sessionStorage.setItem("selectedItem", selected);
    controls.start(isSidebarOpen ? "open" : "collapsed");
  }, [isSidebarOpen, controls, selected]);

  useEffect(() => {
    const menuItems = document.querySelectorAll(".list-item");
    const selectedItem = Array.from(menuItems).find((item) =>
      item.classList.contains("selected")
    );

    selectedItem && console.log(selectedItem);

    if (selectedItem) {
      const translateY = selectedItem.offsetTop;
      highlightedContentRef.current.style.transform = `translateY(${translateY}px)`;
    } else {
      // If no item is selected (on initial load), set the highlightedContentRef to "Home"
      const homeItem = menuItems[0];
      const translateY = homeItem.offsetTop;
      highlightedContentRef.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [selected]);

  const sidebarVariants = {
    open: {
      height: "100vh",
      width: "250px",
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    collapsed: {
      height: "100vh",
      width: "70px",
      transition: { staggerDirection: -1 },
    },
  };

  const listItemIconVariants = {
    open: { opacity: 1, x: -2, transition: { duration: 0.4 } },
    collapsed: { x: 0, transition: { duration: 0.4 } },
  };
  const listItemVariants = {
    open: { opacity: 1, x: 0, y: 0 },
    collapsed: { opacity: 0, x: -10 },
  };

  const listItems = [
    {
      id: 1,
      itemName: "Home",
      path: "",
      itemImg: IoHomeOutline,
    },
    {
      id: 2,
      itemName: "Chats",
      path: "chats",
      itemImg: PiChats,
    },
    {
      id: 3,
      itemName: "Bookmarks",
      path: "bookmarks",
      itemImg: CiBookmark,
    },
    {
      id: 4,
      itemName: "Videos",
      path: "videos",
      itemImg: IoPlayCircleOutline,
    },
    {
      id: 5,
      itemName: "Settings",
      path: "setting",
      itemImg: IoSettingsOutline,
    },
    {
      id: 6,
      itemName: "Help",
      path: "help",
      itemImg: IoIosHelpCircleOutline,
    },
  ];

  const handleSelect = (item) => {
    setSelected(item.itemName);
    navigate(item.path);
  };
  const handleClick = async (e) => {
    try {
      await logoutCall();
      // After successful logout, you may want to redirect the user to the login page or perform any other necessary actions.
      navigate("/login"); // Example: Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle logout error
    }
  };

  return (
    <>
      <div className="sidebarUpper">
        {isSidebarOpen ? (
          <div className="sidebarCross" onClick={() => setIsSidebarOpen(false)}>
            <AnimatedCross />
          </div>
        ) : (
          <MenuOutlinedIcon
            onClick={() => setIsSidebarOpen(true)}
            className="sidebarHamIcon"
          />
        )}
      </div>
      <div className={`sidebarParent`}>
        <motion.div
          className={`sidebarMain `}
          variants={sidebarVariants}
          initial={false}
          animate={controls}
          exit={{ width: 0 }}
        >
          <div
            ref={highlightedContentRef}
            className={` ${selected ? "highlightedContent" : "noHighlight"}`}
          />
          {listItems.map((item, index) => (
            <motion.li
              key={index}
              variants={listItemIconVariants}
              className={`list-item ${
                selected == item.itemName && "selected"
              } ${!isSidebarOpen && "sidebarCollapsed"}`}
              onClick={() => handleSelect(item)}
            >
              <motion.div variants={listItemIconVariants}>
                {item.itemImg &&
                  React.createElement(item.itemImg, { className: "icon" })}
              </motion.div>

              <motion.p variants={listItemVariants} className="sidebarListText">
                {isSidebarOpen && item.itemName}
              </motion.p>
            </motion.li>
          ))}

          {/* <motion.div
            variants={listItemIconVariants}
            className={`userDiv ${!isSidebarOpen && "collapsedUserDiv"}`}
          >
            <div className="userImgDiv">
              <Link to={`/profile/${user.username}`}>
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : `${PF}/person/no_avatar.jpeg`
                  }
                  alt=""
                  className="userImg"
                />
              </Link>
            </div>
            {isSidebarOpen && (
              <div className="userInfoDiv" variants={listItemVariants}>
                <p className="userNameInfo">Bruce Wayne</p>
                <p className="userEmailInfo">bruce@gmail.com</p>
              </div>
            )}
            <LogoutIcon onClick={handleClick} />
          </motion.div> */}
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;
