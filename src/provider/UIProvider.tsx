'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalType = 'login' | 'signup' | 'teacherAuth' | 'teacherSignin' | 'teacherSignup' | null;

interface UIContextType {
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  switchModal: (modal: ModalType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const switchModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  return (
    <UIContext.Provider value={{ 
      activeModal,
      openModal,
      closeModal,
      switchModal,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};