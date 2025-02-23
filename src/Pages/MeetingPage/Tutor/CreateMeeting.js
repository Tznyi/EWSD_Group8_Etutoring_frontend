import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateMeeting.css";
import { useNavigate } from "react-router";
import { CircleArrowLeft } from "lucide-react";
import { useTutor } from "../../../Context/TutorContext";
import { useMeeting } from "../../../Context/MeetingContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";

const CreateMeeting = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingType, setMeetingType] = useState("virtual");
  const [location, setLocation] = useState("");
  const [onlinePlatform, setOnlinePlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [student, setStudent] = useState("");

  const [isAlertBoxOpen, setIsAlertBoxOpen] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  //
  const { assignedStudents } = useTutor();
  const { createMeeting, hasMessage, message, removeMessage, hasError } =
    useMeeting();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !time) {
      setIsAlertBoxOpen(true);
      setLocalMessage("Please select a valid date and time for the meeting.");
      return;
    }

    const meetingData = {
      student_id: student,
      title: title,
      notes: notes,
      type: meetingType,
      location: location,
      platform: onlinePlatform,
      meeting_link: meetingLink,
      date: date,
      time: time,
    };
    createMeeting(meetingData);
  };

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    // <div>hi</div>
    <>
      <div className="container">
        <div className="circularBackBtnHolder" onClick={() => navigate(-1)}>
          <CircleArrowLeft size={34} />
        </div>
        <h2 className="header">Schedule New Meeting</h2>

        <div className="meetingcontainer">
          <form onSubmit={handleSubmit}>
            <label>Enter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              required
            />

            <label>Select Student</label>
            <select
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              required
            >
              <option value="">Select Student</option>
              {assignedStudents.map((student, index) => (
                <option value={student.id} key={index}>
                  {student.name}
                </option>
              ))}
            </select>

            <label>Select Time</label>
            <DatePicker
              selected={time}
              onChange={(t) => setTime(t)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
            />

            <label>Select Date</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD / MM / YYYY"
              minDate={new Date()} // prevent selecting past dates
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
                    onChange={() => setMeetingType("virtual")}
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
                    onChange={() => setMeetingType("in-person")}
                  />{" "}
                  <span>In Person</span>
                </label>
              </div>
            </div>

            {meetingType === "virtual" && (
              <>
                <label>Enter Meeting Link</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Enter Meeting Link"
                />
              </>
            )}

            {meetingType === "virtual" ? (
              <>
                <label>Online Platform</label>
                <input
                  type="text"
                  value={onlinePlatform}
                  onChange={(e) => setOnlinePlatform(e.target.value)}
                  placeholder="Platform"
                />
              </>
            ) : (
              <>
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                />
              </>
            )}

            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes..."
            ></textarea>

            <button type="submit" className="saveButton">
              Save Meeting
            </button>
          </form>
        </div>
      </div>

      {/* --------------------------------- */}

      {hasMessage && (
        <CenterBox closeFun={() => handleFinish()}>{message}</CenterBox>
      )}

      {hasError && (
        <CenterBox closeFun={() => removeMessage()}>{message}</CenterBox>
      )}

      {isAlertBoxOpen && (
        <CenterBox closeFun={() => setIsAlertBoxOpen(false)}>
          {localMessage}
        </CenterBox>
      )}
    </>
  );
};

export default CreateMeeting;
