import { createContext, useCallback, useContext, useReducer } from "react";
import { useUser } from "./UserContext";

const MessageContext = createContext();

const initialState = {
  messageList: [],
  unreadCount: null,
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
    case "setMessageList":
      return {
        ...state,
        messageList: action.payload,
      };
    case "setUnreadCount":
      return {
        ...state,
        unreadCount: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function MessageProvider({ children }) {
  const [
    {
      messageList,
      unreadCount,
      isContextLoading,
      message,
      hasMessage,
      hasError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token } = useUser();

  const fetchMessage = useCallback(
    (id) => {
      async function fetchData() {
        const headers = {
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
            `http://127.0.0.1:8000/api/messages/users/${id}`,
            requestOptions
          );
          const data = await res.json();
          dispatch({ type: "setMessageList", payload: data.messages });
        } catch {
          console.log("Error while fetching Message");
        }
      }

      fetchData();
    },
    [token]
  );

  const fetchIndividualUnreadCount = useCallback(
    (id) => {
      async function fetchData() {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        var requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        dispatch({ type: "setContextLoading", payload: true });

        try {
          const res = await fetch(
            `http://127.0.0.1:8000/api/messages/unread/count/${id}`,
            requestOptions
          );
          const data = await res.json();
          dispatch({
            type: "setUnreadCount",
            payload: data.unreadMessagesCountByUser,
          });
        } catch {
          console.log("Error while fetching Message");
        } finally {
          dispatch({ type: "setContextLoading", payload: false });
        }
      }

      fetchData();
    },
    [token]
  );

  async function sendMessage(id, newMessage) {
    dispatch({ type: "setContextLoading", payload: true });

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      var formdata = new FormData();
      formdata.append("receiver_id", id);
      formdata.append("content", newMessage);

      var requestOptions = {
        method: "POST",
        headers: headers,
        body: formdata,
        redirect: "follow",
      };

      fetch("http://127.0.0.1:8000/api/messages/send", requestOptions);
      fetchMessage(id);
    } catch {
      console.log("Error while sending Message");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function editMessage(id, selectedMessage, newMessage) {
    dispatch({ type: "setContextLoading", payload: true });

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      var urlencoded = new URLSearchParams();
      urlencoded.append("content", newMessage);

      var requestOptions = {
        method: "PUT",
        headers: headers,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(
        `http://127.0.0.1:8000/api/messages/${selectedMessage}`,
        requestOptions
      );
      fetchMessage(id);
    } catch {
      console.log("Error while updating Message");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteMessage(id, selectedMessage) {
    dispatch({ type: "setContextLoading", payload: true });

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      var urlencoded = new URLSearchParams();

      var requestOptions = {
        method: "DELETE",
        headers: headers,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(
        `http://127.0.0.1:8000/api/messages/${selectedMessage}`,
        requestOptions
      );
      fetchMessage(id);
    } catch {
      console.log("Error while deleting Message");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  const makeAsRead = useCallback(
    (id) => {
      async function setData() {
        try {
          const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          var requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow",
          };

          fetch(
            `http://127.0.0.1:8000/api/messages/read/${id}`,
            requestOptions
          );
        } catch {
          console.log("Error while making message as read");
        } finally {
          dispatch({ type: "setContextLoading", payload: false });
        }
      }

      setData();
    },
    [token]
  );

  function removeMessage() {
    dispatch({ type: "removeMessage" });
  }

  return (
    <MessageContext.Provider
      value={{
        messageList,
        unreadCount,
        message,
        hasMessage,
        hasError,
        isContextLoading,

        fetchMessage,
        sendMessage,
        deleteMessage,
        editMessage,
        makeAsRead,
        fetchIndividualUnreadCount,
        removeMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined)
    throw new Error("MessageContext was used outside of MessageProvider");
  return context;
}

export { MessageProvider, useMessage };
