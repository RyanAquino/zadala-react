import React, { useState, createContext } from "react";
import { User, UserContextInterface } from "../Interfaces/User.interface";

const contextDefaultValues: UserContextInterface = {
  user: {} as User,
  setUserData: () => {
    return;
  },
};

export const UserContext = createContext<UserContextInterface>(
  contextDefaultValues
);
export const UserProvider: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [user, setUserData] = useState<User>({} as User);

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
