import { createContext, useContext, useEffect, useReducer } from "react";
import { useUser } from "./UserContext";

const BlogContext = createContext();

const initialState = {
  blogList: [],
  selectedBlog: {},
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
      selectedBlog,
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

  async function fetchBlog() {
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
      dispatch({ type: "setBlogList", payload: data.Blogs });
    } catch {
      console.log("Error while fetching blog data");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

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

  function clearSelect() {
    dispatch({ type: "clearSelect" });
  }

  return (
    <BlogContext.Provider
      value={{
        blogList,
        selectedBlog,
        individualBlogList,
        isContextLoading,
        message,
        hasMessage,
        hasError,

        fetchBlog,
        fetchSelectedBlogList,
        clearSelect,
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
