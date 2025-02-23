import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateMeeting.css";
import { CircleArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useMeeting } from "../../../Context/MeetingContext";
import { useUser } from "../../../Context/UserContext";

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
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const meeting = meetingList.find(
      (meeting) => meeting.id === parseInt(selectedId)
    );

    const dateTimeString = `${meeting.date}T${meeting.time}`;

    setDate(new Date(meeting.date));
    setTime(dateTimeString);
    setTitle(meeting.title);
    setMeetingLink(meeting.meeting_link || "");
    setMeetingType(meeting.type);
    setLocation(meeting.location || "");
    setOnlinePlatform(meeting.platform || "");
    setNotes(meeting.notes || "");
    setStudent(meeting.student.name);
    setStatus(meeting.status);
    setTutor(user.name);
  }, [meetingList, selectedId]);

  return (
    <>
      <div className="container">
        <div className="circularBackBtnHolder" onClick={() => navigate(-1)}>
          <CircleArrowLeft size={34} />
        </div>
        <h2 className="header">Meeting Details</h2>

        <div className="meetingcontainer">
          <form>
            <label>Student</label>
            <input value={student} readOnly />

            <label>Status</label>
            <input value={status} readOnly />
            <label>Enter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              required
              readOnly
            />
            {meetingType === "virtual" && (
              <>
                <label>Enter Meeting Link</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Enter Meeting Link"
                  readOnly
                />
              </>
            )}
            <label>Select Time</label>
            <DatePicker
              selected={time}
              onChange={(t) => setTime(t)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              readOnly
            />
            <label>Select Date</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD / MM / YYYY"
              minDate={new Date()} // prevent selecting past dates
              readOnly
            />
            <label>Type</label>
            <div className="meetingType">
              <div className="mType1">
                <label>
                  <input
                    className="virtual"
                    type="radio"
                    name="type"
                    value="virtual"
                    checked={meetingType === "virtual"}
                    onChange={() => setMeetingType(meetingType)}
                  />{" "}
                  Virtual
                </label>
              </div>
              <div className="mType2">
                <label>
                  <input
                    className="person"
                    type="radio"
                    name="type"
                    value="in-person"
                    checked={meetingType === "in-person"}
                    onChange={() => setMeetingType(meetingType)}
                  />{" "}
                  In Person
                </label>
              </div>
            </div>
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              readOnly
            />
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes..."
              readOnly
            ></textarea>
          </form>
        </div>
      </div>

      {/* --------------------------------- */}
    </>
  );
};

export default ViewMeeting;
