import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useUser } from "./UserContext";

const DocumentContext = createContext();

const initialState = {
  documentList: [],
  commentList: [],
  individualDocumentList: [],
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
    case "setDocumentList":
      return {
        ...state,
        documentList: action.payload,
      };
    case "setCommentList":
      return {
        ...state,
        commentList: action.payload,
      };
    case "setIndividualDocumentList":
      return {
        ...state,
        individualDocumentList: action.payload,
      };
    case "clearSelect":
      return {
        ...state,
        individualDocumentList: [],
      };
    default:
      throw new Error("Unknown action");
  }
}

function DocumentProvider({ children }) {
  const [
    {
      documentList,
      commentList,
      individualDocumentList,
      isContextLoading,
      message,
      hasMessage,
      hasError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token } = useUser();

  const fetchDocument = useCallback(() => {
    async function fetchData() {
      dispatch({ type: "setContextLoading", payload: true });

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
          `http://127.0.0.1:8000/api/documents`,
          requestOptions
        );
        const data = await res.json();
        dispatch({ type: "setDocumentList", payload: data.documents });
      } catch {
        console.log("Error while fetching Document data");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchData();
  }, [token]);

  const fetchSelectedDocumentList = useCallback(
    (id) => {
      async function fetchSelectedDoc() {
        dispatch({ type: "setContextLoading", payload: true });

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
            `http://127.0.0.1:8000/api/documents/${id}`,
            requestOptions
          );
          const data = await res.json();
          dispatch({
            type: "setIndividualDocumentList",
            payload: data.documents,
          });
        } catch {
          console.log("Error while fetching document data");
        } finally {
          dispatch({ type: "setContextLoading", payload: false });
        }
      }

      fetchSelectedDoc();
    },
    [token]
  );

  async function createDocument(newDoc) {
    dispatch({ type: "setContextLoading", payload: true });

    if (!newDoc.file) {
      console.error("No file selected");
      dispatch({ type: "setContextLoading", payload: false });
      return;
    }

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    var formdata = new FormData();
    formdata.append("file", newDoc.file, newDoc.file.name);
    formdata.append("title", newDoc.title);
    formdata.append("description", newDoc.description);

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/documents/upload",
        requestOptions
      );
      const data = await res.json();
      fetchDocument();
      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while creating document");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function updateDocument(id, newDoc) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log(newDoc);

    var formdata = new FormData();
    formdata.append("title", newDoc.title);
    formdata.append("description", newDoc.description);
    if (newDoc.file) {
      formdata.append("file", newDoc.file, newDoc.file.name);
    }

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/documents/${id}/update`,
        requestOptions
      );
      const data = await res.json();
      fetchDocument();
      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while updating document");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteDocument(id) {
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
        `http://127.0.0.1:8000/api/documents/${id}/delete`,
        requestOptions
      );
      const data = await res.json();
      fetchDocument();

      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while leaving comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  // ------------- Comments -------------------

  const getComment = useCallback(
    (id) => {
      async function fetchComment() {
        dispatch({ type: "setContextLoading", payload: true });
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
            `http://127.0.0.1:8000/api/documents/${id}/comments`,
            requestOptions
          );
          const data = await res.json();
          dispatch({ type: "setCommentList", payload: data.comments });
        } catch {
          console.log("Error while fetching comments");
        } finally {
          dispatch({ type: "setContextLoading", payload: false });
        }
      }

      fetchComment();
    },
    [token]
  );

  useEffect(() => {
    fetchDocument();

    const interval = setInterval(() => {
      fetchDocument();
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchDocument]);

  async function createComment(id, newComment) {
    dispatch({ type: "setContextLoading", payload: true });
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    var formdata = new FormData();
    formdata.append("comment", newComment);

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
      redirect: "follow",
    };

    try {
      fetch(
        `http://127.0.0.1:8000/api/documents/${id}/comments`,
        requestOptions
      );
      getComment(id);
    } catch {
      console.log("Error while leaving comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function updateComment(id, newComment, documentId) {
    dispatch({ type: "setContextLoading", payload: true });
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    var urlencoded = new URLSearchParams();
    urlencoded.append("comment", newComment);

    var requestOptions = {
      method: "PUT",
      headers: headers,
      body: urlencoded,
      redirect: "follow",
    };

    try {
      fetch(
        `http://127.0.0.1:8000/api/documents/comments/${id}`,
        requestOptions
      );
      getComment(documentId);
    } catch {
      console.log("Error while updating comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteComment(documentId, commentId) {
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
        `http://127.0.0.1:8000/api/documents/comments/${commentId}`,
        requestOptions
      );
      const data = await res.json();
      getComment(documentId);

      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while leaving comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  function clearSelect() {
    dispatch({ type: "clearSelect" });
  }

  function removeMessage() {
    dispatch({ type: "removeMessage" });
  }

  return (
    <DocumentContext.Provider
      value={{
        documentList,
        commentList,
        individualDocumentList,
        isContextLoading,
        message,
        hasMessage,
        hasError,

        clearSelect,
        fetchDocument,
        fetchSelectedDocumentList,
        createDocument,
        updateDocument,
        getComment,
        createComment,
        updateComment,
        deleteComment,
        deleteDocument,
        removeMessage,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

function useDocument() {
  const context = useContext(DocumentContext);
  if (context === undefined)
    throw new Error("DocumentContext was used outside of DocumentProvider");
  return context;
}

export { DocumentProvider, useDocument };
