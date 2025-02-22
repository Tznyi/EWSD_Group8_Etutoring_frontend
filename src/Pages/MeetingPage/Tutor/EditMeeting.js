import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateMeeting.css";
import { CircleArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useTutor } from "../../../Context/TutorContext";
import { useMeeting } from "../../../Context/MeetingContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";

const CreateMeeting = () => {
  const hasLocation = useLocation();
  const selectedId = hasLocation.state?.id;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingType, setMeetingType] = useState("virtual");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [student, setStudent] = useState("");
  const [status, setStatus] = useState("");

  const [isAlertBoxOpen, setIsAlertBoxOpen] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const { assignedStudents } = useTutor();
  const {
    updateMeeting,
    meetingList,
    hasMessage,
    message,
    removeMessage,
    hasError,
  } = useMeeting();

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
    setNotes(meeting.notes || "");
    setStudent(meeting.student_id);
    setStatus(meeting.status);
  }, [meetingList, selectedId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !time) {
      setIsAlertBoxOpen(true);
      setLocalMessage("Please select a valid date and time for the meeting.");
      return;
    }

    const meetingData = {
      student_id: student,
      status: status,
      title: title,
      notes: notes,
      type: meetingType,
      location: location,
      meeting_link: meetingLink,
      date: date,
      time: time,
    };
    updateMeeting(meetingData, selectedId);
  };

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    <>
      <div className="container">
        <div className="circularBackBtnHolder" onClick={() => navigate(-1)}>
          <CircleArrowLeft size={34} />
        </div>
        <h2 className="header">Update Schedule Meeting</h2>

        <div className="meetingcontainer">
          <form onSubmit={handleSubmit}>
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

            <label>Select Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <label>Enter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              required
            />

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
            />

            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes..."
            ></textarea>

            <button type="submit" className="saveButton">
              Update Meeting
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
