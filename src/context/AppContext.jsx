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
  const [lastOrder, setLastOrderState] = useState(() => load('careu_last_order', null));
  const [orders, setOrdersState] = useState(() => load('careu_orders', []));
  const [changeLog, setChangeLogState] = useState(() => load('careu_changelog', []));
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

  function logChange(entry) {
    const next = [{ ...entry, timestamp: new Date().toISOString(), user: 'Dr. Sarah Chen' }, ...changeLog].slice(0, 50);
    save('careu_changelog', next);
    setChangeLogState(next);
  }

  function setLastOrder(order) {
    save('careu_last_order', order);
    setLastOrderState(order);
    const next = [{ ...order, createdAt: new Date().toISOString() }, ...orders];
    save('careu_orders', next);
    setOrdersState(next);
  }

  function setProducts(updater) {
    const next = typeof updater === 'function' ? updater(products) : updater;
    save('careu_products', next);
    setProductsState(next);
  }

  function setSchedules(updater) {
    const next = typeof updater === 'function' ? updater(schedules) : updater;
    save('careu_schedules', next);
    setSchedulesState(next);
  }

  function setVendors(updater) {
    const next = typeof updater === 'function' ? updater(vendors) : updater;
    save('careu_vendors', next);
    setVendorsState(next);
  }

  return (
    <AppContext.Provider value={{ isLoggedIn, login, logout, products, setProducts, schedules, setSchedules, vendors, setVendors, lastOrder, setLastOrder, orders, changeLog, logChange }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
