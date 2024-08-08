import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  readonly config = {
    port: 3000,
    privatePort: 3001,
    useCachingInterceptor: true,
  };
}
