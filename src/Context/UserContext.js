const { createContext, useReducer, useContext } = require("react");

const Base_URL = "http://127.0.0.1:8000/api/auth";

const UserContext = createContext();

const initialState = {
  user: {},
  token: "",
  isAuthenticated: false,
  isContextLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return { ...state, isContextLoading: action.payload };
    case "logIn":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "logOut":
      return {
        ...state,
        user: {},
        token: "",
        isAuthenticated: false,
      };
    default:
      throw new Error("Unknown action");
  }
}

function UserProvider({ children }) {
  const [{ user, token, isAuthenticated, isContextLoading }, dispatch] =
    useReducer(reducer, initialState);

  async function logIn(email, password) {
    try {
      dispatch({ type: "setContextLoading", payload: true });

      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);

      const requestOptions = {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formdata,
      };

      const res = await fetch(`${Base_URL}/login`, requestOptions);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch({
        type: "logIn",
        payload: { user: data.user, token: data.token },
      });
    } catch (error) {
      console.error("Login error:", error.message);
      window.alert(error.message);
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function logOut(inputToken) {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${inputToken}`,
    };

    try {
      const res = await fetch(`${Base_URL}/logout`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      console.log(data);

      dispatch({ type: "logOut" });
    } catch {
      console.log("Error while logging out");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  return (
    <UserContext.Provider
      value={{ user, token, logIn, logOut, isAuthenticated, isContextLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUser };
