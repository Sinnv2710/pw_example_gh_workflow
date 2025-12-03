import { APIRequestContext } from '@playwright/test';
import { ApiRequestModule } from './apiRequestModule';

export class AccountApi {
  readonly endpoint: string;
  readonly api: ApiRequestModule;

  constructor(request: APIRequestContext, endpoint: string) {
    this.endpoint = endpoint;
    this.api = new ApiRequestModule(request);
  }
}
