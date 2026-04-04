'use client';
import { createContext } from 'react';

export const ActiveSceneContext = createContext(false);
export const NavigateContext    = createContext(() => {});
