import { createContext } from 'react';
import { API } from '@/service/api';

export interface APIContext extends API {}

export const APIContext = createContext({} as APIContext);
