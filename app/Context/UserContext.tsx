import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserData {
  UserId:string;
  CropRotationPlanRefId: string;
  Email: string;
  PlotsRefId: string;
  RecordsRefId: string;
  CurrentCropsRefId: string;
  DiscussionRecordRefId:string,
  Username: string;
  ExpensesRefId:string,
}



interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
  storeUserData: (userData: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetch_User_data called from UserContext 1....")
        const storedData = await AsyncStorage.getItem("userData");
        console.log("storedData : ",storedData)
        if (storedData) {
          setUser(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error retrieving userData:", error);
      }
    };
    fetchUserData();
  }, []);


  const storeUserData = async (userData: UserData) => {
    try {
      setUser(userData);
    } catch (error) {
      console.error("Error storing userData:", error);
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout,storeUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
