import React, { useContext, useState } from "react";

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, SetDestination] = useState<string>("");
  const [checkIn, SetCheckIn] = useState<Date>(new Date());
  const [checkOut, SetCheckOut] = useState<Date>(new Date());
  const [adultCount, SetAdultCount] = useState<number>(1);
  const [childCount, SetChildCount] = useState<number>(0);
  const [hotelId,SetHotelId] = useState<string>('')

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?:string,
  ) => {
    SetDestination(destination);
    SetCheckIn(checkIn);
    SetCheckOut(checkOut);
    SetAdultCount(adultCount);
    SetChildCount(childCount);
    if(hotelId){
        SetHotelId(hotelId);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        saveSearchValues,
        hotelId,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext
}
