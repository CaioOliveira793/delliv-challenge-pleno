import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/AppStore';
import { router } from '@/config/router';
import { APIContext } from '@/context/APIContext';
import { ServiceAPI } from '@/service/ServiceAPI';

function App() {
	return (
		<StrictMode>
			<APIContext.Provider value={ServiceAPI}>
				<ReduxProvider store={store}>
					<RouterProvider router={router} />
				</ReduxProvider>
			</APIContext.Provider>
		</StrictMode>
	);
}

export default App;
