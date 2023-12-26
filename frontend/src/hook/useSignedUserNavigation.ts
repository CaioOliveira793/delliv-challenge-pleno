import { useLocation, useNavigate } from 'react-router-dom';
import { AppPath } from '@/config/router';

export const REDIRECT_QUERY_PARAM = 'redirect_to';

export type SignedNavigate = () => void;

export function useSignedUserNavigation(): SignedNavigate {
	const navigate = useNavigate();
	const location = useLocation();

	function signInNavigate() {
		const query = new URLSearchParams(location.search);
		const redirectPath = query.get(REDIRECT_QUERY_PARAM);

		if (redirectPath && redirectPath[0] === '/' && redirectPath !== AppPath.SignIn) {
			navigate(redirectPath);
			return;
		}

		navigate(AppPath.Order);
	}

	return signInNavigate;
}
