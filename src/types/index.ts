export type UserPlan = 'free' | 'pro_49' | 'ultimate_79';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan: UserPlan;
}

export interface GeoLocation {
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
}

export interface TransferFileMetadata {
  id?: string;
  name: string;
  size: number;
  path: string;
  type: string;
}

export interface TransferFileItem {
  id: string;
  name: string;
  size: number;
  path: string;
  type: string;
  blob?: Blob | File;
}

export interface CreateTransferRequest {
  files: {
    name: string;
    size: number;
    path: string;
    type: string;
  }[];
  senderName?: string;
}

export interface CreateTransferResponse {
  transferId: string;
  code: string;
  expiresAt: string;
  senderLocation?: GeoLocation;
  uploadUrls?: string[];
}

export type TransferState = 'waiting' | 'delivered' | 'expired';

export interface TransferStatusResponse {
  state: TransferState;
  expiresAt: string;
}

export interface VerifyCodeResponse {
  transferId: string;
  files: TransferFileItem[];
  totalSize: number;
  senderLocation?: GeoLocation;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  attemptsLeft?: number;
  retryAfterSec?: number;
}

export interface FolderTreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  size: number;
  type?: string;
  id?: string;
  children?: FolderTreeNode[];
}

export type SendStep = 'select' | 'review' | 'uploading' | 'ready';
export type ReceiveStep = 'enter-code' | 'preview' | 'downloading' | 'done';

export interface UploadProgress {
  percent: number;
  speed: string;
  bytesUploaded: number;
  totalBytes: number;
}

export interface TransferAuditLog {
  id: string;
  transferId: string;
  code: string;
  timestamp: string;
  date: string;
  senderName: string;
  receiverName: string;
  senderIp: string;
  senderLocation: string;
  receiverIp: string;
  receiverLocation: string;
  fileCount: number;
  filesSummary: {
    name: string;
    path: string;
    size: number;
    type: string;
  }[];
  totalSize: number;
  status: 'delivered' | 'expired';
  plan: UserPlan;
}

export type PaywallReason =
  | 'folder_login'
  | 'size_over_500mb'
  | 'size_over_5gb'
  | 'exe_file';
