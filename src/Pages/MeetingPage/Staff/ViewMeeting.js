import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateMeeting.css";
import { CircleArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useMeeting } from "../../../Context/MeetingContext";

const ViewMeeting = () => {
  const hasLocation = useLocation();
  const selectedId = hasLocation.state?.id;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingType, setMeetingType] = useState("virtual");
  const [location, setLocation] = useState("");
  const [onlinePlatform, setOnlinePlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [student, setStudent] = useState("");
  const [tutor, setTutor] = useState("");
  const [status, setStatus] = useState("");

  const { meetingList } = useMeeting();

  const navigate = useNavigate();

  useEffect(() => {

    if (!selectedId) {
      console.error("No selected ID provided.");
      return;
    }

    const meeting = meetingList.find(
      (meeting) => meeting.id === parseInt(selectedId)
    );

    if (!meeting) {
      console.error(`Meeting with ID ${selectedId} not found.`);
      return;
    }

    const dateTimeString = `${meeting.date}T${meeting.time}`;

    setDate(new Date(meeting.date));
    setTime(dateTimeString);
    setTitle(meeting.title || "No Title");
    setMeetingLink(meeting.meeting_link || "");
    setMeetingType(meeting.type);
    setLocation(meeting.location || "");
    setOnlinePlatform(meeting.onlinePlatform || "")
    setNotes(meeting.notes || "");
    setStudent(meeting.student.name);
    setTutor(meeting.tutor.name);
    setStatus(meeting.status);
  }, [meetingList, selectedId]);

  // Ensure date is set before rendering date/time
  const formattedDate = date ? date.toLocaleDateString() : "Loading...";
  const formattedTime = time ? new Date(time).toLocaleTimeString() : "Loading...";

  return (
    <>
      <div className="container">
        <div className="circularBackBtnHolder" onClick={() => navigate(-1)}>
          <CircleArrowLeft size={34} />
        </div>
        <h2 className="header">Meeting Details</h2>

        <div className="meetingcontainer">
          <form>
            {/* Student Row */}
            <div className="formRow">
              <label>Student</label>
              <div className="separator">:</div>
              <div className="value">{student}</div>
            </div>

            {/* Tutor Row */}
            <div className="formRow">
              <label>Tutor</label>
              <div className="separator">:</div>
              <div className="value">{tutor}</div>
            </div>

            {/* Status Row */}
            <div className="formRow">
              <label>Status</label>
              <div className="separator">:</div>
              <div className="value">{status}</div>
            </div>

            {/* Title Row */}
            <div className="formRow">
              <label>Title</label>
              <div className="separator">:</div>
              <div className="value">{title}</div>
            </div>

            {/* Date and Time Row */}
            <div className="formRow">
              <label>Date</label>
              <div className="separator">:</div>
              <div className="value">{formattedDate}</div>
            </div>
            <div className="formRow">
              <label>Time</label>
              <div className="separator">:</div>
              <div className="value">{formattedTime}</div>
            </div>

            {/* Meeting Type Row */}
            <div className="formRow">
              <label>Meeting Type</label>
              <div className="separator">:</div>
              <div className="value">{meetingType === "virtual" ? "Virtual" : "In-person"}</div>
            </div>

            {/* Conditional Rendering for Location/Meeting Link/Platform */}
            {meetingType === "virtual" ? (
              <>
                {/* Meeting Link */}
                <div className="formRow">
                  <label>Meeting Link</label>
                  <div className="separator">:</div>
                  <div className="value">
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                      {meetingLink || "No link provided"}
                    </a>
                  </div>
                </div>

                {/* Online Platform */}
                <div className="formRow">
                  <label>Online Platform</label>
                  <div className="separator">:</div>
                  <div className="value">{onlinePlatform || "No platform specified"}</div>
                </div>
              </>
            ) : (
              // Location Row for In-Person
              <div className="formRow">
                <label>Location</label>
                <div className="separator">:</div>
                <div className="value">{location || "No location specified"}</div>
              </div>
            )}

            {/* Notes Row */}
            <div className="formRow">
              <label>Notes</label>
              <div className="separator">:</div>
              <div className="value">{notes.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}</div>
            </div>
          </form>
        </div >
      </div >
    </>
  );
};


export default ViewMeeting;
