

// Type definitions for Abacus.AI Pipeline data

export interface Pipeline {
  pipelineId: string;
  name: string;
  pipelineVariableType?: string;
  cron?: string;
  isProd?: boolean;
  createdAt?: string;
  projectId?: string;
}

export interface PipelineVersion {
  pipelineVersion: string;
  pipelineId: string;
  status?: string;
  error?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface PipelineExecution {
  pipelineExecutionId: string;
  pipelineId: string;
  pipelineVersion?: string;
  status?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ManufacturerData {
  id: string;
  name: string;
  status?: string;
  discoveredAt?: string;
  details?: Record<string, any>;
  category?: string;
  location?: string;
}

export interface ProductData {
  id: string;
  name: string;
  manufacturer?: string;
  category?: string;
  documentType?: string;
  createdAt?: string;
  details?: Record<string, any>;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PipelineStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecution?: string;
  status?: string;
}

export interface FilterOptions {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  manufacturer?: string;
  documentType?: string;
}

