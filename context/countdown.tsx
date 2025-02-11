import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CountdownContext = createContext(null);

export const CountdownProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && count > 0) {
      timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else if (count === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, count]);

  const startCountdown = useCallback((initialCount) => {
    if (!isActive) {
      setCount(initialCount);
      setIsActive(true);
    }
  }, [isActive]);

  return (
    <CountdownContext.Provider value={{ count, startCountdown, isActive }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  return useContext(CountdownContext);
};
