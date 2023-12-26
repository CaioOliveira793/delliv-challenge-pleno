/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Application domain */
	readonly APP_DOMAIN: string;
	/** REST API address */
	readonly APP_API_ADDRESS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
