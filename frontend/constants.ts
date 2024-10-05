export const NETWORK = import.meta.env.VITE_APP_NETWORK ?? "testnet";
export const MODULE_ADDRESS = "0x53ebd2be721663376dc5a39997d54f160bfb4195da6db5edb97fab2927e90c37";
export const CREATOR_ADDRESS = import.meta.env.VITE_COLLECTION_CREATOR_ADDRESS;
export const COLLECTION_ADDRESS = import.meta.env.VITE_COLLECTION_ADDRESS;
export const IS_DEV = Boolean(import.meta.env.DEV);
export const IS_PROD = Boolean(import.meta.env.PROD);
