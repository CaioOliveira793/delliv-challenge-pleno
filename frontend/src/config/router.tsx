import { createBrowserRouter } from 'react-router-dom';
import Root from '@/page/Root';
import ErrorSurface from '@/page/ErrorSurface';
import NotFound from '@/page/NotFound';
import SignIn from '@/page/auth/SignIn';
import SignUp from '@/page/auth/SignUp';
import SearchOrder from '@/page/order/SearchOrder';
import OrderSurface from '@/page/order/OrderSurface';

export const enum AppPath {
	Root = '/',
	SignIn = '/signin',
	SignUp = '/signup',
	Order = '/order',
}

export const router = createBrowserRouter([
	{ path: AppPath.Root, element: <Root />, errorElement: <ErrorSurface /> },
	{ path: AppPath.SignIn, element: <SignIn />, errorElement: <ErrorSurface /> },
	{ path: AppPath.SignUp, element: <SignUp />, errorElement: <ErrorSurface /> },
	{ path: AppPath.Order, element: <SearchOrder />, errorElement: <ErrorSurface /> },
	{ path: AppPath.Order + '/:id', element: <OrderSurface />, errorElement: <ErrorSurface /> },
	{ path: '*', element: <NotFound />, errorElement: <ErrorSurface /> },
]);
