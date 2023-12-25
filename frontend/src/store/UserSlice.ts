import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SignedUser } from '@/service/Resource';

export interface AccountSlice {
	value: SignedUser | null;
}

export const SIGN_IN_ACTION: string = 'account/sign-in';

export const accountSlice = createSlice({
	name: 'account',
	initialState: {
		value: null,
	} as AccountSlice,
	reducers: {
		signIn: (state, action: PayloadAction<SignedUser, typeof SIGN_IN_ACTION>) => {
			state.value = action.payload;
		},
		signOut: state => {
			state.value = null;
		},
	},
});

export const signInAction = accountSlice.actions.signIn;
export const signOutAction = accountSlice.actions.signOut;

export default accountSlice.reducer;
