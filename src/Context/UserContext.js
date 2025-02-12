const { createContext, useReducer, useContext } = require("react");

const Base_URL = "http://...";

const UserContext = createContext();

const initialState = {
  user: {},
  isAuthenticated: false,
  isContextLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return {
        ...state,
        isContextLoading: action.payload,
      };
    case "logIn":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logOut":
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    default:
      throw new Error("Unknown action");
  }
}

function UserProvider({ children }) {
  const [{ user, isContextLoading, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function logIn(email, password) {
    try {
      dispatch({ type: "setContextLoading", payload: true });

      const res = await fetch(
        `${Base_URL}/user?email[eq]=${email}&password[eq]=${password}`
      );
      const data = await res.json();
      if (data.data.length < 1) {
        window.alert("Wrong email or password!");
      } else {
        dispatch({ type: "logIn", payload: data.data[0] });
      }
    } catch {
      console.log("Error while logging in");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  function logOut() {
    dispatch({ type: "logOut" });
  }

  return (
    <UserContext.Provider
      value={{ user, logIn, logOut, isAuthenticated, isContextLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("UserContext was used outside of UserProvider");
  return context;
}

export { UserProvider, useUser };
