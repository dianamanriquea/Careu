import { createContext, useContext, useState } from 'react';
import { products as seedProducts, feeSchedules as seedSchedules, vendors as seedVendors } from '../data/seedData';

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('careu_auth') === 'true');
  const [products, setProductsState] = useState(() => load('careu_products', seedProducts));
  const [schedules, setSchedulesState] = useState(() => load('careu_schedules', seedSchedules));
  const [vendors, setVendorsState] = useState(() => load('careu_vendors', seedVendors));

  function login() {
    localStorage.setItem('careu_auth', 'true');
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('careu_auth');
    setIsLoggedIn(false);
  }

  function setProducts(updater) {
    setProductsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save('careu_products', next);
      return next;
    });
  }

  function setSchedules(updater) {
    setSchedulesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save('careu_schedules', next);
      return next;
    });
  }

  function setVendors(updater) {
    setVendorsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save('careu_vendors', next);
      return next;
    });
  }

  return (
    <AppContext.Provider value={{ isLoggedIn, login, logout, products, setProducts, schedules, setSchedules, vendors, setVendors }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
