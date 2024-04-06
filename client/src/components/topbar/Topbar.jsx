import { useContext, useRef, useState } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import axios from "axios";
import { useTheme } from "../../context/ColorContext";
import { useMediaQuery } from "react-responsive";
import AccountMenu from "../AccountMenu";

const Topbar = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 769px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleSearch = async () => {
    const username = searchRef.current.value;
    if (!username) {
      return;
    }
    console.log(username);
    setSearch(username);
    try {
      const userData = await getUser(username);
      if (userData) {
        navigate(`/profile/${username}`);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      // Handle API error
      console.error("Error fetching user data:", error);
    }
    searchRef.current.value = "";
  };

  const handleSearchMobile = () => {
    navigate("/search");
  };
  const getUser = async (username) => {
    try {
      const response = await axios.get(`/api/users/`, { params: { username } });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    // <div className={`topbarContainer ${theme && "light"}`}>
    <div className={`topbarContainer`}>
      <div className="topbarLeft">
        <div className="sidebarLogo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className={`logo`}>GoSocial</span>
          </Link>
        </div>
        {/* <div className="topbarLinks">
          <span className="topbarLink">Home</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
      </div>
      <div className="topbarCenter">
        {/* {isTabletOrMobile ? (
          <div className="searchIconDiv" onClick={()=>handleSearchMobile}>
            <Search className="searchIcon" />
          </div>
          <SearchMobile searchRef={searchRef} handleSearch={handleSearch} />
        ) : ( */}
        <div className="searchbar">
          <input
            type="text"
            ref={searchRef}
            name="searchInput"
            placeholder="Search for friend, post, or video"
            className="searchInput"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <span onClick={handleSearch} className="search">
            Search
          </span>
        </div>
        {/* )} */}
      </div>
      <div className="topbarRight">
        <div
          className={`topbarRightWrapper 
          `}
        >
          {isTabletOrMobile ? (
            <AccountMenu />
          ) : (
            <>
              <div className="topbarIcons">
                <div className="topbarIconItem">
                  <Person />
                  <span className="topbarIconBadge">1</span>
                </div>
                <div className="topbarIconItem">
                  <Chat />
                  <span className="topbarIconBadge">2</span>
                </div>
                <div className="topbarIconItem">
                  <Notifications />
                  <span className="topbarIconBadge">1</span>
                </div>
              </div>

              <button className="toggle" onClick={() => setTheme(!theme)}>
                {theme ? <MdDarkMode /> : <CiLight />}
              </button>
              <Link to={`/profile/${user.username}`}>
                <img
                  src={
                    user.profilePicture
                      ? // PF + user.profilePicture
                        user.profilePicture
                      : `${PF}/person/no_avatar.jpeg`
                  }
                  alt=""
                  className="topbarImage"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

const SearchMobile = ({ handleSearch, searchRef }) => {
  return (
    <div className="searchbar">
      <input
        type="text"
        ref={searchRef}
        name="searchInput"
        placeholder="Search for friend, post, or video"
        className="searchInput"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <span onClick={handleSearch} className="search">
        <Search className="searchIcon" />
      </span>
    </div>
  );
};
