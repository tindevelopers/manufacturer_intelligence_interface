

// API client for Abacus.AI integration

const ABACUS_API_BASE_URL = 'https://api.abacus.ai';
const API_KEY = process.env.ABACUS_API_KEY || '';

export class AbacusAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY;
    this.baseUrl = ABACUS_API_BASE_URL;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apiKey': this.apiKey,
        ...options?.headers,
      },
    });

    if (!response?.ok) {
      throw new Error(`API request failed: ${response?.statusText || 'Unknown error'}`);
    }

    return response.json() as T;
  }

  async getPipeline(pipelineId: string) {
    return this.fetch(`/v0/describePipeline`, {
      method: 'POST',
      body: JSON.stringify({ pipelineId }),
    });
  }

  async listPipelineVersions(pipelineId: string) {
    return this.fetch(`/v0/listPipelineVersions`, {
      method: 'POST',
      body: JSON.stringify({ pipelineId, limit: 100 }),
    });
  }

  async getPipelineVersion(pipelineVersion: string) {
    return this.fetch(`/v0/describePipelineVersion`, {
      method: 'POST',
      body: JSON.stringify({ pipelineVersion }),
    });
  }

  async listPipelineExecutions(pipelineId: string) {
    return this.fetch(`/v0/listPipelineExecutions`, {
      method: 'POST',
      body: JSON.stringify({ pipelineId, limit: 50 }),
    });
  }

  async getFeatureGroupData(featureGroupId: string) {
    return this.fetch(`/v0/describeFeatureGroup`, {
      method: 'POST',
      body: JSON.stringify({ featureGroupId }),
    });
  }
}

export const apiClient = new AbacusAPIClient();

