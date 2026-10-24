import { auth } from '../config/firebase';

export class ApiError extends Error {
  code: string;
  status: number;
  extras: Record<string, unknown>;

  constructor(code: string, message: string, status: number, extras: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.extras = extras;
  }
}

export interface AppConfig {
  codeTtlSeconds: number;
  downloadWindowSeconds: number;
  maxAttempts: number;
  freeLimitBytes: number;
  standardLimitBytes: number;
  maxTransferBytes: number;
  prices: {
    standardPaise: number;
    largePaise: number;
  };
  planValidDays: number;
  executableExtensions: string[];
}

export interface UserIdentity {
  kind: 'user' | 'guest';
  id: string;
  displayName: string;
  emailVerified: boolean;
}

export interface UserActivity {
  state: 'idle' | 'sending' | 'receiving';
  transferId?: string | null;
}

export interface EntitlementInfo {
  planCode: string;
  maxBytes: number;
  expiresAt: string;
}

export interface SessionResponse {
  identity: UserIdentity;
  activity: UserActivity;
  entitlement: EntitlementInfo | null;
}

export interface QuoteItem {
  name: string;
  size: number;
  path: string;
  type: string;
}

export interface QuoteResponse {
  allowed: boolean;
  tier: 'free' | 'standard' | 'large';
  pricePaise: number;
  requirements: ('LOGIN_REQUIRED' | 'EMAIL_NOT_VERIFIED' | 'PAYMENT_REQUIRED' | 'PLAN_REQUIRED_FOR_EXECUTABLES')[];
  totalBytes: number;
}

export interface ItemMapping {
  index: number;
  itemId: string;
}

export interface CreateTransferResponse {
  transferId: string;
  items: ItemMapping[];
}

export interface CompleteTransferResponse {
  code: string;
  expiresAt: string;
  state: 'ready';
}

export interface TransferStatusResponse {
  state: 'uploading' | 'ready' | 'claimed' | 'delivered' | 'expired' | 'cancelled';
  expiresAt: string;
}

export interface ReceiverItem {
  id: string;
  name: string;
  size: number;
  path: string;
  type: string;
}

export interface VerifyCodeResponse {
  transferId: string;
  sender: {
    displayName: string;
  };
  items: ReceiverItem[];
  totalSize: number;
  downloadToken: string;
  downloadExpiresAt: string;
  originalFilename?: string;
  hasFolder?: boolean;
}

export interface ReceiverItemStatus {
  id: string;
  downloaded: boolean;
}

export interface ReceiverStatusResponse {
  state: string;
  items: ReceiverItemStatus[];
  downloadExpiresAt: string;
}

export interface HistoryItem {
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface HistoryEntry {
  id: string;
  role: 'sent' | 'received';
  counterpartName: string;
  items: HistoryItem[];
  totalBytes: number;
  state: string;
  createdAt: string;
  deliveredAt?: string | null;
}

export interface HistoryResponse {
  entries: HistoryEntry[];
  nextCursor?: string | null;
}

export interface PlanDto {
  code: string;
  name: string;
  pricePaise: number;
  maxBytes: number;
  validDays: number;
}

export interface PlansResponse {
  plans: PlanDto[];
}

export interface EntitlementDto {
  id: string;
  planCode: string;
  planName: string;
  startsAt: string;
  expiresAt: string;
  status: string;
  maxBytes: number;
}

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  // Check 30-minute session validity
  const expiresStr = typeof window !== 'undefined' ? localStorage.getItem('dropcode-auth-expires-at') : null;
  const isExpired = expiresStr ? Date.now() >= Number(expiresStr) : false;

  if (!isExpired) {
    let token: string | null = null;
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {
        // Fallback to stored token
      }
    }
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('dropcode-auth-token');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      // Clear local session if token was rejected
      localStorage.removeItem('dropcode-auth-user');
      localStorage.removeItem('dropcode-auth-token');
      localStorage.removeItem('dropcode-auth-expires-at');
    }

    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: { message: res.statusText || 'An error occurred' } };
    }

    const errorObj = errorData.error || {};
    const code = errorObj.code || (res.status === 401 ? 'LOGIN_REQUIRED' : 'UNKNOWN_ERROR');
    const message = errorObj.message || 'Request failed';
    const { code: _c, message: _m, ...extras } = errorObj;

    throw new ApiError(code, message, res.status, extras);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json();
}

export class DropCodeApiClient {
  // Config
  async getConfig(): Promise<AppConfig> {
    return request<AppConfig>('/config');
  }

  // Session
  async getSession(): Promise<SessionResponse> {
    return request<SessionResponse>('/session');
  }

  // Heartbeat
  async heartbeat(): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>('/activity/heartbeat', {
      method: 'POST',
    });
  }

  // Transfers Quote
  async quote(items: QuoteItem[], hasFolder: boolean): Promise<QuoteResponse> {
    return request<QuoteResponse>('/transfers/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, hasFolder }),
    });
  }

  // Create Transfer
  async createTransfer(
    items: QuoteItem[],
    hasFolder: boolean,
    senderName?: string
  ): Promise<CreateTransferResponse> {
    return request<CreateTransferResponse>('/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, hasFolder, senderName }),
    });
  }

  // Upload individual Item via XHR PUT with real progress
  async uploadItem(
    transferId: string,
    itemId: string,
    file: File | Blob,
    onProgress?: (loaded: number, total: number) => void,
    signal?: AbortSignal
  ): Promise<{ ok: boolean }> {
    let token: string | null = null;
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {
        // Ignore token failure
      }
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${BASE_URL}/transfers/${transferId}/items/${itemId}`, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new DOMException('Upload aborted', 'AbortError'));
        });
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(e.loaded, e.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ ok: true });
        } else {
          let errorObj: any = {};
          try {
            const body = JSON.parse(xhr.responseText);
            errorObj = body.error || {};
          } catch {
            errorObj = { message: xhr.statusText };
          }
          const code = errorObj.code || 'UPLOAD_FAILED';
          const message = errorObj.message || 'File upload failed';
          reject(new ApiError(code, message, xhr.status, errorObj));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError('NETWORK_ERROR', 'Network connection failed during upload', 0));
      };

      xhr.send(file);
    });
  }

  // Complete Transfer
  async completeTransfer(transferId: string): Promise<CompleteTransferResponse> {
    return request<CompleteTransferResponse>(`/transfers/${transferId}/complete`, {
      method: 'POST',
    });
  }

  // Sender Transfer Status
  async getSenderStatus(transferId: string): Promise<TransferStatusResponse> {
    return request<TransferStatusResponse>(`/transfers/${transferId}/status`);
  }

  // Sender Cancel Transfer
  async cancelTransfer(transferId: string): Promise<void> {
    return request<void>(`/transfers/${transferId}`, {
      method: 'DELETE',
    });
  }

  // Receiver Verify Code
  async verifyCode(code: string): Promise<VerifyCodeResponse> {
    const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return request<VerifyCodeResponse>('/receive/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: cleanCode }),
    });
  }

  // Receiver Status
  async getReceiverStatus(transferId: string): Promise<ReceiverStatusResponse> {
    return request<ReceiverStatusResponse>(`/receive/${transferId}/status`);
  }

  // Item download URL
  getItemDownloadUrl(transferId: string, itemId: string, downloadToken: string): string {
    return `${BASE_URL}/receive/${transferId}/items/${itemId}?t=${encodeURIComponent(downloadToken)}`;
  }

  // Download item as decrypted Blob directly
  async downloadItemAsBlob(transferId: string, itemId: string, downloadToken: string): Promise<Blob> {
    const url = this.getItemDownloadUrl(transferId, itemId, downloadToken);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download item (${res.status} ${res.statusText})`);
    }
    return res.blob();
  }

  // Zip download URL
  getZipDownloadUrl(transferId: string, downloadToken: string): string {
    return `${BASE_URL}/receive/${transferId}/zip?t=${encodeURIComponent(downloadToken)}`;
  }

  // Abandon receive
  async abandonReceive(transferId: string): Promise<void> {
    return request<void>(`/receive/${transferId}`, {
      method: 'DELETE',
    });
  }

  // Keyset Paginated History
  async getHistory(role: 'sent' | 'received', cursor?: string, limit: number = 20): Promise<HistoryResponse> {
    const params = new URLSearchParams({ role, limit: limit.toString() });
    if (cursor) params.set('cursor', cursor);
    return request<HistoryResponse>(`/history?${params.toString()}`);
  }

  // Billing Plans
  async getPlans(): Promise<PlansResponse> {
    return request<PlansResponse>('/billing/plans');
  }

  // Billing Entitlement
  async getEntitlement(): Promise<EntitlementDto | null> {
    return request<EntitlementDto | null>('/billing/entitlement');
  }

  // Billing Orders
  async createOrder(planCode: string): Promise<CashfreeOrderResponse> {
    return request<CashfreeOrderResponse>('/billing/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planCode }),
    });
  }

  // Verify Order
  async verifyOrder(orderId: string): Promise<{ success: boolean; entitlement: EntitlementDto | null }> {
    return request<{ success: boolean; entitlement: EntitlementDto | null }>('/billing/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
  }

  // Profile API
  async getProfile(): Promise<ProfileResponse> {
    return request<ProfileResponse>('/profile');
  }

  async updateProfile(data: { displayName?: string; username?: string }): Promise<ProfileResponse> {
    return request<ProfileResponse>('/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export interface CashfreeOrderResponse {
  orderId: string;
  paymentSessionId: string;
  amountPaise: number;
  planCode: string;
  cfOrderId?: string;
  environment: 'sandbox' | 'production';
}

export interface UserStats {
  sentCount: number;
  receivedCount: number;
  totalSentBytes: number;
  totalReceivedBytes: number;
}

export interface ProfileResponse {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  emailVerified: boolean;
  createdAt: string;
  entitlement: EntitlementDto | null;
  stats: UserStats;
}

export const apiClient = new DropCodeApiClient();
