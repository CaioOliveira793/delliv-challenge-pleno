import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '@/store/UserSlice';

export const store = configureStore({
	reducer: {
		account: accountReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoreState: true,
				ignoreActions: true,
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
