declare namespace NodeJS {
 interface ProcessEnv {
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  [key: string]: string | undefined;
 }
}

declare const process: {
 env: NodeJS.ProcessEnv;
};
