'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// UI State Types
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface UIState {
  notifications: Notification[];
  modal: ModalState;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  userPreferences: {
    autoSave: boolean;
    defaultTemplate: 'modern' | 'ats-friendly';
    showTutorial: boolean;
  };
}

// Action Types
type UIAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'OPEN_MODAL'; payload: { type: string; data?: any } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UIState['userPreferences']> };

// Initial State
const initialState: UIState = {
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
  },
  sidebarOpen: false,
  theme: 'light',
  userPreferences: {
    autoSave: true,
    defaultTemplate: 'modern',
    showTutorial: true,
  },
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    
    case 'OPEN_MODAL':
      return {
        ...state,
        modal: {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data,
        },
      };
    
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: {
          isOpen: false,
          type: null,
        },
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'UPDATE_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload,
        },
      };
    
    default:
      return state;
  }
}

// Context
interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  // Convenience methods
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updatePreferences: (preferences: Partial<UIState['userPreferences']>) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider Component
interface UIStateProviderProps {
  children: ReactNode;
}

export const UIStateProvider: React.FC<UIStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const fullNotification = { ...notification, id };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
    
    // Auto-remove notification after duration (default: 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, duration);
  };

  const hideNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const openModal = (type: string, data?: any) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type, data } });
  };

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const updatePreferences = (preferences: Partial<UIState['userPreferences']>) => {
    dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });
  };

  const value: UIContextType = {
    state,
    dispatch,
    showNotification,
    hideNotification,
    openModal,
    closeModal,
    toggleSidebar,
    setTheme,
    updatePreferences,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

// Hook
export const useUIState = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}; 