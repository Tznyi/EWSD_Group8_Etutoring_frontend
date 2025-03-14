import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useUser } from "./UserContext";

const BlogContext = createContext();

const initialState = {
  blogList: [],
  commentList: [],
  individualBlogList: [],
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
    case "setBlogList":
      return {
        ...state,
        blogList: action.payload,
      };
    case "setCommentList":
      return {
        ...state,
        commentList: action.payload,
      };
    case "setIndividualBlogList":
      return {
        ...state,
        individualBlogList: action.payload,
      };
    case "clearSelect":
      return {
        ...state,
        individualBlogList: [],
      };
    default:
      throw new Error("Unknown action");
  }
}

function BlogProvider({ children }) {
  const [
    {
      blogList,
      commentList,
      individualBlogList,
      isContextLoading,
      message,
      hasMessage,
      hasError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token } = useUser();

  useEffect(() => {
    async function initialBlogFetch() {
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
          `http://127.0.0.1:8000/api/blogs`,
          requestOptions
        );
        const data = await res.json();
        dispatch({ type: "setBlogList", payload: data.blogs });
      } catch {
        console.log("Error while fetching blog data");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    initialBlogFetch();

    const interval = setInterval(() => {
      initialBlogFetch();
    }, 300000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchBlog = useCallback(() => {
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
          `http://127.0.0.1:8000/api/blogs`,
          requestOptions
        );
        const data = await res.json();
        dispatch({ type: "setBlogList", payload: data.blogs });
      } catch {
        console.log("Error while fetching blog data");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchData();
  }, [token]);

  async function fetchSelectedBlogList(id) {
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
        `http://127.0.0.1:8000/api/blogs/user/${id}`,
        requestOptions
      );
      const data = await res.json();
      dispatch({ type: "setIndividualBlogList", payload: data.blogs });
    } catch {
      console.log("Error while fetching blog data");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function createBlog(newBlog) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(newBlog),
      redirect: "follow",
    };

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/blogs",
        requestOptions
      );
      const data = await res.json();
      fetchBlog();
      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while creating blogs");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function updateBlog(id, newBlog) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    var requestOptions = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(newBlog),
      redirect: "follow",
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/blogs/${id}`,
        requestOptions
      );
      const data = await res.json();
      fetchBlog();
      if (data.error) {
        dispatch({ type: "showError", payload: data.error });
      } else {
        dispatch({ type: "showMessage", payload: data.message });
      }
    } catch {
      console.log("Error while updating blogs");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteBlog(blogId) {
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
        `http://127.0.0.1:8000/api/blogs/${blogId}`,
        requestOptions
      );
      const data = await res.json();
      fetchBlog();

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
            `http://127.0.0.1:8000/api/blogs/${id}/comments`,
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
      fetch(`http://127.0.0.1:8000/api/blogs/${id}/comments`, requestOptions);
      getComment(id);
    } catch {
      console.log("Error while leaving comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function updateComment(id, newComment, postId) {
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
      fetch(`http://127.0.0.1:8000/api/blogs/comments/${id}`, requestOptions);
      getComment(postId);
    } catch {
      console.log("Error while updating comments");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function deleteComment(blogId, commentId) {
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
        `http://127.0.0.1:8000/api/blogs/comments/${commentId}`,
        requestOptions
      );
      const data = await res.json();
      getComment(blogId);

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
    <BlogContext.Provider
      value={{
        blogList,
        commentList,
        individualBlogList,
        isContextLoading,
        message,
        hasMessage,
        hasError,

        fetchBlog,
        getComment,
        createBlog,
        updateBlog,
        deleteBlog,
        createComment,
        updateComment,
        deleteComment,
        fetchSelectedBlogList,
        clearSelect,
        removeMessage,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined)
    throw new Error("BlogContext was used outside of BlogProvider");
  return context;
}

export { BlogProvider, useBlog };
