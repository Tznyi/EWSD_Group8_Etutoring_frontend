import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Menu,
  CircleArrowLeft,
  User,
  List,
  Calendar,
  Upload,
  BookOpen,
  House,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import { useUser } from "../../Context/UserContext";
import CenterBox from "../CenterBox/CenterBox";

export default function Sidebar({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);

  const { user, logOut, isFirstLogin, setIsFirstLogin, token } = useUser();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Confirm with the user before logging out
    // const confirmed = window.confirm("Are you sure you want to logout?");

    // if (confirmed) {
    //   logOut(token); // Proceed with logout if confirmed
    // }

    setIsLogoutConfirmationOpen(true);
  };

  // Add a useEffect to automatically close the sidebar on mobile if the window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true); // Open sidebar for larger screens
      } else {
        setIsOpen(false); // Close sidebar for mobile screens by default
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define sidebar menu based on role
  const getMenuItems = () => {
    switch (role) {
      case "staff":
        return [
          { to: "./report", icon: House, label: "Home" },
          { to: "./meeting", icon: Calendar, label: "Meeting" },
          { to: "./documents", icon: Upload, label: "Documents" },
          { to: "./assign", icon: List, label: "Allocate/Reallocate" },
          { to: "./blogs", icon: BookOpen, label: "Blogs" },
        ];
      case "tutor":
        return [
          { to: "./report", icon: House, label: "Home" },
          { to: "./blogs", icon: BookOpen, label: "Student Blogs" },
          { to: "./meeting", icon: Calendar, label: "Meeting" },
          { to: "./documents", icon: Upload, label: "Documents" },
        ];
      case "student":
        return [
          { to: "./home", icon: House, label: "Home" },
          { to: "./tutor", icon: User, label: "Tutor Information" },
          { to: "./blogs", icon: BookOpen, label: "Blogs" },
          { to: "./meeting", icon: Calendar, label: "Meeting" },
          { to: "./documents", icon: Upload, label: "Documents" },
        ];
      default:
        return [];
    }
  };

  function doLogout() {
    navigate("./profile");
    logOut(token);
  }

  return (
    <>
      <div className="container">
        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
          {/* Toggle Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
            {isOpen ? <CircleArrowLeft size={24} /> : <Menu size={24} />}
          </button>

          {/* Profile Section */}
          <Link to="./profile" className="profile-section">
            <img
              src={user.profile_picture}
              alt="User Profile"
              className="profile-img"
              onError={(e) => (e.target.src = "/user_photo.jpg")}
            />
            <br />
            {isOpen && <span className="profile-name">{user.name}</span>}
          </Link>

          {/* Menu Items */}
          <nav className="menu">
            {getMenuItems().map((item, index) => (
              <SidebarLink
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isOpen={isOpen}
              />
            ))}
          </nav>

          {/* Logout Button */}
          <button onClick={() => handleLogout()} className="logoutbtn">
            <LogOut size={24} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ----------------- */}

      {isLogoutConfirmationOpen && (
        <CenterBox closeFun={() => setIsLogoutConfirmationOpen(false)}>
          <span className="confirmationQuestion">
            Are you sure you want to logout?
          </span>
          <div className="btnHolder">
            <div>
              <div className="form-submit-btn" onClick={() => doLogout()}>
                Confirm
              </div>
            </div>
            <div>
              <div
                className="form-cancel-btn"
                onClick={() => setIsLogoutConfirmationOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </CenterBox>
      )}

      {isFirstLogin && (
        <CenterBox closeFun={() => setIsFirstLogin()}>
          <span className="welcomeNote">
            {`Welcome ${user.name}! 
We're excited to have you on board. Let's get started on your learning journey!`}
          </span>
        </CenterBox>
      )}
    </>
  );
}

function SidebarLink({ to, icon: Icon, label, isOpen }) {
  return (
    <Link to={to} className="menu-item">
      <Icon size={24} />
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
