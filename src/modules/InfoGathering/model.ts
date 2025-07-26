export interface DataItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRequest {
  format: "pdf" | "word";
  dataIds?: string[];
  category?: string;
  includeMetadata?: boolean;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
}
