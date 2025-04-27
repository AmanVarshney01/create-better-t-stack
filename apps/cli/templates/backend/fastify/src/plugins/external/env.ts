import env from '@fastify/env';

declare module 'fastify' {
 export interface FastifyInstance {
  config: {
   PORT: number;
   COOKIE_SECRET: string;
   COOKIE_NAME: string;
   COOKIE_SECURED: boolean;
   RATE_LIMIT_MAX: number;
   UPLOAD_DIRNAME: string;
   UPLOAD_TASKS_DIRNAME: string;
   DATABASE_URL: string,
   FASTIFY_CLOSE_GRACE_DELAY: number,
   LOG_LEVEL: string,
   CORS_ORIGIN: string,
   APP_NAME: string,
   SUPPORTMAIL: string,
   IMAGEURL: string,
   MAIL_FOOTER: string,
   MAIL: string,
   PASS: string,
   REDIS_HOST: string,
   REDIS_PORT: number,
   REDIS_PASSWORD: string,
   S3_ENDPOINT: string,
   S3_SECRET_KEY: string,
   S3_ACCESS_ID: string,
   S3_REGION: string,
   S3_BUCKET: string,
   DATABASE_NAME: string,
  };
 }
}

const schema = {
 type: 'object',
 required: [
  'PORT',
  'DATABASE_URL',
  'MAIL',
  'PASS',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'S3_ENDPOINT',
  'COOKIE_SECRET',
  'COOKIE_NAME',
  'COOKIE_SECURED',
  'FASTIFY_CLOSE_GRACE_DELAY',
  'LOG_LEVEL',
  'CORS_ORIGIN',
  'S3_SECRET_KEY',
  'S3_ACCESS_ID',
  'S3_REGION',
  'S3_BUCKET',
 ],
 properties: {

  // Security
  COOKIE_SECRET: {
   type: 'string'
  },
  COOKIE_NAME: {
   type: 'string'
  },
  COOKIE_SECURED: {
   type: 'boolean',
   default: true
  },
  RATE_LIMIT_MAX: {
   type: 'number',
   default: 100 // Put it to 4 in your .env file for tests
  },
  // Email
  MAIL_FOOTER: {
   type: 'string',
   default: 'Your Company'
  },
  APP_NAME: {
   type: 'string',
   default: 'Better-t-angular-stack'
  },
  SUPPORTMAIL: {
   type: 'string',
   default: 'example@gmail.com'
  },
  IMAGEURL: {
   type: 'string',
   default: 'your-image-url'
  },
  MAIL: {
   type: 'string',
   default: 'example@gmail.com',
  },
  PASS: {
   type: 'string',
   default: "email-password"
  },
  FASTIFY_CLOSE_GRACE_DELAY: {
   type: 'number',
   default: 1000
  },
  LOG_LEVEL: {
   type: 'string',
   default: 'info'
  },
  CORS_ORIGIN: {
   type: 'string',
   default: '*'
  },
  // Files
  UPLOAD_DIRNAME: {
   type: 'string',
   minLength: 1,
   pattern: '^(?!.*\\.{2}).*$',
   default: 'uploads'
  },
  UPLOAD_TASKS_DIRNAME: {
   type: 'string',
   default: 'tasks'
  },
  // Redis
  REDIS_HOST: {
   type: 'string',
   default: 'localhost'
  },
  REDIS_PORT: {
   type: 'number',
   default: 6379
  },
  REDIS_PASSWORD: {
   type: 'string',
   default: 'your-redis-password'
  },
  // S3
  S3_ENDPOINT: {
   type: 'string',
   default: 'https://sgp1.digitaloceanspaces.com/'
  },
  S3_SECRET_KEY: {
   type: 'string',
   default: "your-bucket-secret"
  },
  S3_ACCESS_ID: {
   type: 'string',
   default: "your-bucket-access-id"
  },
  S3_REGION: {
   type: 'string',
   default: 'sgp1'
  },
  S3_BUCKET: {
   type: 'string',
   default: 'your-bucket-name'
  },
  DATABASE_NAME: {
   type: 'string',
   default: 'test'
  },
  PORT: {
   type: 'number',
   default: 3000
  },
  DATABASE_URL: {
   type: 'string',
   default: 'mongodb://localhost:27017/test'
  },
 }
};

export const autoConfig = {
 // Decorate Fastify instance with `config` key
 // Optional, default: 'config'
 confKey: 'config',

 // Schema to validate
 schema,

 // Needed to read .env in root folder
 dotenv: true,
 // or, pass config options available on dotenv module
 // dotenv: {
 //   path: `${import.meta.dirname}/.env`,
 //   debug: true
 // }

 // Source for the configuration data
 // Optional, default: process.env
 data: process.env
};

/**
 * This plugins helps to check environment variables.
 *
 * @see {@link https://github.com/fastify/fastify-env}
 */
export default env;
