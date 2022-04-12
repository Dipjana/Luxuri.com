import React, { createContext, useState, useEffect } from "react";
import {getToken, getEmplyeeId} from './authApi';
import moment from "moment";

export const AuthContext = createContext();

// This context provider is passed to any component requiring the context
export const AuthProvider = ({ children }) => {

 

  const [brokerId, setBrokerId] = useState(localStorage.getItem('brokerId'));
  const [authToken, setAuthToken] = useState(localStorage.getItem('luxuri_token'));
  const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId'));

  const authenticate=()=>{
    localStorage.removeItem('luxuri_token')
    getToken().then(resp=>{
      localStorage.setItem('luxuri_token', resp.data.access_token);
      localStorage.setItem('brokerId', resp.data.brokerID);
      localStorage.setItem('expired', resp.data['.expires']);
      setBrokerId(resp.data.brokerID);
      setAuthToken(resp.data.access_token);
    })
  }

  useEffect(()=>{
    if(localStorage.getItem('luxuri_token')===null || localStorage.getItem('expired')===null){
      authenticate()
    }else{
      let expiredDate=moment(new Date(localStorage.getItem('expired'))).subtract(5, "days").format('Y-MM-DD');
      if(moment().format('Y-MM-DD')>expiredDate){
        authenticate()
      }
    }
  },[]);
  useEffect(()=>{
    if(brokerId!=null && employeeId===null){
      getEmplyeeId(brokerId).then(empResp=>{
        setEmployeeId(empResp.data.Data);
        localStorage.setItem('employeeId', empResp.data.Data);
      })
    }
    
  },[brokerId]);

  return (
    <AuthContext.Provider
      value={{
        brokerId,
        authToken,
        employeeId,
        setBrokerId,
        setAuthToken,
        setEmployeeId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};