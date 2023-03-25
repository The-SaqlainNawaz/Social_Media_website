import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (prop) => {
  const CurrentUser = {
    created_at: "",
    email: "",
    id: 0,
    name: "",
    updated_at: "",
  };
  const [user, setUser] = useState(CurrentUser);
  function updateUser(user) {
    setUser(user);
  }
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {prop.children}
    </UserContext.Provider>
  );
};

export default UserState;
