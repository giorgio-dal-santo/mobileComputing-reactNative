import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({
  userDataInit,
  orderDataInit,
  isRegisteredInit,
  userLocationInit,
  canUseLocationInit,
  children,
}) => {
  const [userData, setUserData] = useState(userDataInit);
  const [orderData, setOrderData] = useState(orderDataInit);
  const [isRegistered, setIsRegistered] = useState(isRegisteredInit);
  const [userLocation, setUserLocation] = useState(userLocationInit);
  const [canUseLocation, setCanUseLocation] = useState(canUseLocationInit);
  

  useEffect(() => {
    setUserData(userDataInit);
  }, [userDataInit]);

  useEffect(() => {
    setOrderData(orderDataInit);
  }, [orderDataInit]);

  useEffect(() => {
    setIsRegistered(isRegisteredInit);
  }, [isRegisteredInit]);

  useEffect(() => {
    setUserLocation(userLocationInit);
  }, [userLocationInit]);

  useEffect(() => {
    setCanUseLocation(canUseLocationInit);
  }, [canUseLocationInit]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, orderData, setOrderData, isRegistered, setIsRegistered, userLocation, setUserLocation, canUseLocation, setCanUseLocation }}
    >
      {children}
    </UserContext.Provider>
  );
};
