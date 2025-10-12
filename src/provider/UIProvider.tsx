'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  closeLoginModal: () => void;
  closeSignUpModal: () => void;
  switchToSignUp: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openLoginModal = () => { setIsSignUpModalOpen(false); setIsLoginModalOpen(true); };
  const openSignUpModal = () => { setIsLoginModalOpen(false); setIsSignUpModalOpen(true); };
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  const switchToSignUp = () => { closeLoginModal(); openSignUpModal(); };

  return (
    <UIContext.Provider value={{ isLoginModalOpen, isSignUpModalOpen, openLoginModal, openSignUpModal, closeLoginModal, closeSignUpModal, switchToSignUp }}>
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