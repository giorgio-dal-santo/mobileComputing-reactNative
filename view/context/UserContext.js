import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({
  userDataInit,
  orderDataInit,
  isRegisteredInit,
  children,
}) => {
  const [userData, setUserData] = useState(userDataInit);
  const [orderData, setOrderData] = useState(orderDataInit);
  const [isRegistered, setIsRegistered] = useState(isRegisteredInit);

  useEffect(() => {
    setUserData(userDataInit);
  }, [userDataInit]);

  useEffect(() => {
    setOrderData(orderDataInit);
  }, [orderDataInit]);

  useEffect(() => {
    setIsRegistered(isRegisteredInit);
  }, [isRegisteredInit]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, orderData, setOrderData, isRegistered, setIsRegistered }}
    >
      {children}
    </UserContext.Provider>
  );
};
