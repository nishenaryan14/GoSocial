import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { IoHomeOutline } from "react-icons/io5";
import { PiChats } from "react-icons/pi";
import { BsChatSquareDots } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import AnimatedCross from "./AnimatedCross";
import LogoutIcon from "@mui/icons-material/Logout";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
const MobileSidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => {
    const storedSelected = sessionStorage.getItem("selectedItem");
    return storedSelected || null;
  });
  const highlightedContentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    sessionStorage.setItem("selectedItem", selected);
    controls.start(isOpen ? "open" : "collapsed");
  }, [isOpen, controls, selected]);

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
      height: "0",
      width: "0",
      transition: { staggerDirection: -1 },
    },
  };

  const listItemVariants = {
    open: { opacity: 1, x: 0 },
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
      itemName: "Notification",
      path: "notification",
      itemImg: BsChatSquareDots,
    },
    {
      id: 4,
      itemName: "Transaction History",
      path: "transaction-history",
      itemImg: GrTransaction,
    },
    {
      id: 5,
      itemName: "Settings",
      itemImg: IoSettingsOutline,
    },
    {
      id: 6,
      itemName: "Help",
      itemImg: IoIosHelpCircleOutline,
    },
  ];
  const handleSelect = (item) => {
    setSelected(item.itemName);
    navigate(item.path);
  };
  return (
    <>
      {isOpen ? (
        <div className="sidebarCross" onClick={() => setIsOpen(false)}>
          <AnimatedCross />
        </div>
      ) : (
        <MenuOutlinedIcon
          onClick={() => setIsOpen(true)}
          className="sidebarHamIcon"
        />
      )}
      <div className="sidebarParent">
        <AnimatePresence>
          <motion.div
            className="sidebarMain mobileView"
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
                variants={listItemVariants}
                className={`list-item ${
                  selected == item.itemName && "selected"
                }`}
                onClick={() => handleSelect(item)}
              >
                {item.itemImg &&
                  React.createElement(item.itemImg, { className: "icon" })}
                {isOpen && item.itemName}
              </motion.li>
            ))}
            {/* <motion.div
              variants={listItemVariants}
              className={`userDiv ${!isOpen && "collapsedUserDiv"}`}
            >
              <div className="userImgDiv">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6CUO73m6N7iTPO2XakfJfMILittboCTwiQ&usqp=CAU"
                  alt=""
                  className="userImg"
                />
              </div>
              {isOpen && (
                <div className="userInfoDiv">
                  <p className="userNameInfo">Bruce Wayne</p>
                  <p className="userEmailInfo">bruce@gmail.com</p>
                </div>
              )}
              <LogoutIcon />
            </motion.div> */}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default MobileSidebar;
