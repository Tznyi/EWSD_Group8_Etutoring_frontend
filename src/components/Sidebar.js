import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu,CircleArrowLeft, User, List, Calendar, Upload, Users, BookOpen } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
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
          <img src="/user_photo.jpg" alt="User Profile" className="profile-img" onError={(e) => e.target.src = '/default-photo.jpg'} />
          <br/>
          {isOpen && <span className="profile-name">User Name</span>}
        </Link>

        {/* Menu Items */}
        <nav className="menu">
          <SidebarLink to="/tutors" icon={Users} span label="Tutor List" isOpen={isOpen} />
          <SidebarLink to="/students" icon={User} label="Student List" isOpen={isOpen} />
          <SidebarLink to="/schedule" icon={Calendar} label="Schedule Meeting" isOpen={isOpen} />
          <SidebarLink to="/files" icon={Upload} label="Uploaded Files" isOpen={isOpen} />
          <SidebarLink to="/allocate" icon={List} label="Allocate/Reallocate" isOpen={isOpen} />
          <SidebarLink to="/blogs" icon={BookOpen} label="Blogs" isOpen={isOpen} />
        </nav>
      </div>

      {/* Main Content
      <div className="main-content">Main Content Here</div> */}
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
