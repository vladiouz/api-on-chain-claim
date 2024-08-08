import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async getNetworkProvider(): Promise<ProxyNetworkProvider> {
    const provider = new ProxyNetworkProvider(
      'https://devnet-gateway.multiversx.com',
    );

    return provider;
  }
}
