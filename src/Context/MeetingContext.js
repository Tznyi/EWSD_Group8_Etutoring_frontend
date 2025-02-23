import { createContext, useContext, useEffect, useReducer } from "react";
import { useUser } from "./UserContext";

const MeetingContext = createContext();

const initialState = {
  meetingList: [],
  selectedMeeting: {},
  isContextLoading: false,
  message: "",
  hasMessage: false,
  hasError: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return {
        ...state,
        isContextLoading: action.payload,
      };
    case "showMessage":
      return {
        ...state,
        message: action.payload,
        hasMessage: true,
      };
    case "showError":
      return {
        ...state,
        message: action.payload,
        hasError: true,
      };

    case "removeMessage":
      return {
        ...state,
        message: "",
        hasMessage: false,
        hasError: false,
      };
    case "setMeetingList":
      return {
        ...state,
        meetingList: action.payload,
      };
    case "setSelectedMeeting":
      return {
        ...state,
        selectedMeeting: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function MeetingProvider({ children }) {
  const [
    {
      meetingList,
      selectedMeeting,
      isContextLoading,
      message,
      hasMessage,
      hasError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token, user } = useUser();

  useEffect(() => {
    async function fetchMeetingList() {
      dispatch({ type: "setContextLoading", payload: true });

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/${user.role}/meetings`,
          requestOptions
        );
        const data = await res.json();
        dispatch({ type: "setMeetingList", payload: data.meetings });
      } catch {
        console.log("Error while fetching meeting data");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchMeetingList();
  }, [token, user]);

  async function fetchMeeting() {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/${user.role}/meetings`,
        requestOptions
      );
      const data = await res.json();
      dispatch({ type: "setMeetingList", payload: data.meetings });
    } catch {
      console.log("Error while fetching meeting data");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteMeeting(id) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    var requestOptions = {
      method: "DELETE",
      headers: headers,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/meetings/${id}`,
        requestOptions
      );
      const data = await res.json();
      fetchMeeting();
      dispatch({ type: "showMessage", payload: data.message });
    } catch {
      console.log("Error while deleting meeting data");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function createMeeting(data) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const date = new Date(data.date);
    const time = new Date(data.time);

    const formattedDate = date.toLocaleDateString("en-CA");
    const formattedTime = time.toTimeString().slice(0, 8);

    console.log(`Date: ${date}`);
    console.log(`Fecieve Date: ${data.date}`);
    console.log(`Formatted Date: ${formattedDate}`);

    var formdata = new FormData();
    formdata.append("student_id", data.student_id);
    formdata.append("title", data.title);
    formdata.append("notes", data.notes);
    formdata.append("type", data.type);
    formdata.append("location", data.location);
    formdata.append("meeting_link", data.meeting_link);
    formdata.append("date", formattedDate);
    formdata.append("time", formattedTime);

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/meetings/create`,
        requestOptions
      );
      const data = await res.json();
      fetchMeeting();
      if (data.errors) {
        dispatch({ type: "showError", payload: data.message });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while creating meeting");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function updateMeeting(data, id) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const date = new Date(data.date);
    const time = new Date(data.time);

    const formattedDate = date.toLocaleDateString("en-CA");

    const formattedTime = time.toTimeString().slice(0, 8);

    var urlencoded = new URLSearchParams();
    urlencoded.append("student_id", data.student_id);
    urlencoded.append("title", data.title);
    urlencoded.append("notes", data.notes);
    urlencoded.append("type", data.type);
    urlencoded.append("location", data.location);
    urlencoded.append("meeting_link", data.meeting_link);
    urlencoded.append("status", data.status);
    urlencoded.append("date", formattedDate);
    urlencoded.append("time", formattedTime);

    var requestOptions = {
      method: "PATCH",
      headers: headers,
      body: urlencoded,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/meetings/${id}/update`,
        requestOptions
      );
      const data = await res.json();
      fetchMeeting();
      if (data.errors) {
        dispatch({ type: "showError", payload: data.message });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while updating meeting");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function requestMeeting(data) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const date = new Date(data.date);
    const time = new Date(data.time);

    const formattedDate = date.toISOString().slice(0, 10);
    const formattedTime = time.toTimeString().slice(0, 8);

    var formdata = new FormData();
    formdata.append("title", data.title);
    formdata.append("notes", data.notes);
    formdata.append("type", data.type);
    formdata.append("location", data.location);
    formdata.append("meeting_link", data.meeting_link);
    formdata.append("date", formattedDate);
    formdata.append("time", formattedTime);

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/meetings/request`,
        requestOptions
      );
      const data = await res.json();
      fetchMeeting();
      if (data.errors) {
        dispatch({ type: "showError", payload: data.message });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while requesting meeting");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  function removeMessage() {
    dispatch({ type: "removeMessage" });
  }

  return (
    <MeetingContext.Provider
      value={{
        meetingList,
        selectedMeeting,
        isContextLoading,
        message,
        hasMessage,
        hasError,

        createMeeting,
        updateMeeting,
        requestMeeting,
        deleteMeeting,
        removeMessage,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

function useMeeting() {
  const context = useContext(MeetingContext);
  if (context === undefined)
    throw new Error("MeetingContext was used outside of MeetingProvider");
  return context;
}

export { MeetingProvider, useMeeting };
