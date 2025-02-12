import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Menu,
  CircleArrowLeft,
  User,
  List,
  Calendar,
  Upload,
  Users,
  BookOpen,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ role }) {
  const [isOpen, setIsOpen] = useState(false);

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
          { to: "/tutors", icon: Users, label: "Tutor List" },
          { to: "/students", icon: User, label: "Student List" },
          { to: "/schedule", icon: Calendar, label: "Schedule Meeting" },
          { to: "/files", icon: Upload, label: "Uploaded Files" },
          { to: "/allocate", icon: List, label: "Allocate/Reallocate" },
          { to: "/blogs", icon: BookOpen, label: "Blogs" },
        ];
      case "tutor":
        return [
          { to: "/assigned-students", icon: Users, label: "Assigned Students" },
          { to: "/student-blogs", icon: BookOpen, label: "Student Blogs" },
          { to: "/schedule", icon: Calendar, label: "Schedule Meeting" },
          { to: "/files", icon: Upload, label: "Uploaded Files" },
        ];
      case "student":
        return [
          { to: "/tutor-info", icon: User, label: "Tutor Information" },
          { to: "/blogs", icon: BookOpen, label: "Blogs" },
          { to: "/schedule", icon: Calendar, label: "Schedule Meeting" },
          { to: "/files", icon: Upload, label: "Uploaded Files" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          {isOpen ? <CircleArrowLeft size={24} /> : <Menu size={24} />}
        </button>

        {/* Profile Section */}
        <Link to="/profile" className="profile-section">
          <img
            src="/profile-pic.png"
            alt="User Profile"
            className="profile-img"
            onError={(e) => (e.target.src = "/default-photo.jpg")}
          />
          <br />
          {isOpen && <span className="profile-name">User Name</span>}
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
      </div>
    </div>
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
