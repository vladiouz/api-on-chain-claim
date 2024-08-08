// import { ConfigurationLoaderSettings } from '@multiversx/sdk-nestjs-common';
// import { join } from 'path';
import { Config } from '../entities/config';

// const CONFIG_DIRECTORY = '../../../../config/';
// const YAML_CONFIG_FILENAME = CONFIG_DIRECTORY + 'config.yaml';
// const CONFIG_SCHEMA_FILENAME = CONFIG_DIRECTORY + 'schema.yaml';

export function configuration(): Config {
  // const configPath = join(__dirname, YAML_CONFIG_FILENAME);
  // const schemaPath = join(__dirname, CONFIG_SCHEMA_FILENAME);

  return {
    apps: {
      api: {
        port: 3000,
        privatePort: 3001,
        useCachingInterceptor: true,
      },
      cacheWarmer: {
        port: 3002,
      },
      queueWorker: {
        port: 3003,
      },
      transactionsProcessor: {
        port: 3004,
        maxLookBehind: 100,
      },
    },
    libs: {
      common: {
        network: 'devnet',
        urls: {
          api: 'https://devnet-gateway.multiversx.com',
        },
        database: {
          host: 'localhost',
          port: 27017,
          name: 'multiversx',
          tlsAllowInvalidCertificates: true,
        },
        redis: {
          host: 'localhost',
          port: 6379,
        },
        nativeAuth: {
          maxExpirySeconds: 86400,
          acceptedOrigins: ['http://localhost:3000'],
        },
        security: {
          admins: ['admin'],
        },
      },
    },
  };
}
