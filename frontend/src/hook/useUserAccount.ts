import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIContext } from '@/context/APIContext';
import { AppPath } from '@/config/router';
import { useAppSelector, useAppDispatch } from '@/hook/useStore';
import { signInAction, signOutAction } from '@/store/UserSlice';
import { ResponseType } from '@/service/common';
import type { AuthenticateUserResponse, CreateUserResponse } from '@/service/iam';
import type { CreateUserData, SignedUser, UserCredential } from '@/service/Resource';

export interface UseUserAccountReturn {
	readonly state: SignedUser | null;
	/**
	 * Create a new account
	 */
	createUser(data: CreateUserData): Promise<CreateUserResponse>;
	/**
	 * Authenticate the user updating the current user account.
	 * @param credential User credential
	 * @returns A UserAuthentication result or a AuthenticationError
	 */
	signIn(credential: UserCredential): Promise<AuthenticateUserResponse>;
	/**
	 * Sign out exiting the user session and navigating to the sing-in page.
	 * @param redirectPath pathname to redirect from the sing-in page after a user authentication.
	 */
	signOut(redirectPath?: string): void;
	/**
	 * Returns `true` if a user is currently authenticated.
	 */
	isUserAuthenticated(): boolean;
}

export function useUserAccount(): UseUserAccountReturn {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const api = useContext(APIContext);
	const state = useAppSelector(state => state.account.value);

	async function createUser(data: CreateUserData): Promise<CreateUserResponse> {
		const result = await api.createUser(data);
		if (result.type === ResponseType.CREATED) {
			dispatch(signInAction(structuredClone(result.value)));
		} else {
			dispatch(signOutAction());
		}

		return result;
	}

	async function signIn(credential: UserCredential): Promise<AuthenticateUserResponse> {
		const result = await api.authenticateUser(credential);
		if (result.type === ResponseType.OK) {
			dispatch(signInAction(structuredClone(result.value)));
		} else {
			dispatch(signOutAction());
		}

		return result;
	}

	function signOut(redirectPath?: string) {
		const path = redirectPath ? AppPath.SignIn + '?redirect_to=' + redirectPath : AppPath.SignIn;
		navigate(path, { replace: false });
	}

	function isUserAuthenticated(): boolean {
		return state !== null;
	}

	return {
		state,
		createUser,
		signIn,
		signOut,
		isUserAuthenticated,
	};
}

/**
 * Unwrap the user account state signing out in case the user is not authenticated.
 */
export function useUserAccountUnwraped(): SignedUser | null {
	const userAccount = useUserAccount();
	const [state, setState] = useState<SignedUser | null>(null);

	useEffect(() => {
		if (userAccount.state === null) {
			userAccount.signOut(globalThis.location.pathname);
			setState(null);
		}
		setState(userAccount.state);
	}, [userAccount]);

	return state;
}
