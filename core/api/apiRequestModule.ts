import { APIRequestContext, expect, request } from '@playwright/test';

export class ApiRequestModule {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async sendGet(endpoint: string, headers: Record<string, string> = {}) {
    const response = await this.request.get(endpoint, { headers });
    expect(response.status()).toBe(200);
    return response;
  }

  async sendPost(endpoint: string, payload: object = {}, headers: Record<string, string> = {}) {
    const response = await this.request.post(endpoint, { data: payload, headers });
    return response;
  }

  async sendPut(endpoint: string, payload: object = {}, headers: Record<string, string> = {}) {
    const response = await this.request.put(endpoint, { data: payload, headers });
    expect(response.status()).toBe(200);
    return response;
  }

  async sendDelete(endpoint: string, headers: Record<string, string> = {}) {
    const response = await this.request.delete(endpoint, { headers });
    expect(response.status()).toBe(200);
    return response;
  }
}
