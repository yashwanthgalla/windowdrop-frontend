import { create } from 'zustand';
import { apiClient, ApiError } from '../api/client';
import type {
  AppConfig,
  SessionResponse,
  QuoteResponse,
  VerifyCodeResponse,
  ReceiverStatusResponse,
  TransferStatusResponse,
} from '../api/client';
import { useToastStore } from './useToastStore';

export interface SelectedFileItem {
  id: string;
  file: File;
  path: string;
}

export type SendStep = 'select' | 'review' | 'uploading' | 'ready';
export type ReceiveStep = 'enter-code' | 'preview' | 'delivered';

interface TransferStoreState {
  // Navigation & Config & Session
  activeTab: 'send' | 'receive';
  setActiveTab: (tab: 'send' | 'receive') => void;
  config: AppConfig | null;
  session: SessionResponse | null;
  activityBanner: string | null;
  initApp: () => Promise<void>;

  // Heartbeat
  startHeartbeat: () => void;
  stopHeartbeat: () => void;

  // Paywall state
  paywallOpen: boolean;
  paywallPlanCode: 'standard' | 'large';
  openPaywall: (planCode: 'standard' | 'large') => void;
  closePaywall: () => void;

  // Send Flow
  sendStep: SendStep;
  setSendStep: (step: SendStep) => void;
  selectedFiles: SelectedFileItem[];
  hasFolder: boolean;
  addSelectedFiles: (files: { file: File; path: string }[], isFolder?: boolean) => void;
  removeSelectedFile: (id: string) => void;
  clearSelectedFiles: () => void;
  quote: QuoteResponse | null;
  isQuoting: boolean;
  fetchQuote: () => Promise<void>;
  uploadProgress: {
    percent: number;
    speed: string;
    eta: string;
    uploadedBytes: number;
    totalBytes: number;
  };
  createdTransferId: string | null;
  shareCode: string | null;
  codeExpiresAt: string | null;
  senderStatus: TransferStatusResponse['state'] | null;
  startUpload: (senderName?: string) => Promise<void>;
  cancelSending: () => Promise<void>;

  // Receive Flow
  receiveStep: ReceiveStep;
  setReceiveStep: (step: ReceiveStep) => void;
  code: string;
  setCode: (code: string) => void;
  isVerifying: boolean;
  verificationError: string | null;
  attemptsLeft: number | null;
  cooldownSeconds: number | null;
  verifiedTransfer: VerifyCodeResponse | null;
  receiverStatus: ReceiverStatusResponse | null;
  verifyCode: (code: string) => Promise<void>;
  cancelReceiving: () => Promise<void>;
  pollReceiverStatus: () => Promise<void>;

  resetSendFlow: () => void;
  resetReceiveFlow: () => void;
}

let heartbeatInterval: any = null;
let statusPollInterval: any = null;
let quoteDebounceTimer: any = null;

export const useTransferStore = create<TransferStoreState>((set, get) => ({
  activeTab: 'send',
  setActiveTab: (tab) => {
    const { session } = get();
    if (session?.activity.state === 'sending' && tab === 'receive') return;
    if (session?.activity.state === 'receiving' && tab === 'send') return;
    set({ activeTab: tab });
  },

  config: null,
  session: null,
  activityBanner: null,

  initApp: async () => {
    try {
      const [config, session] = await Promise.all([
        apiClient.getConfig().catch(() => null),
        apiClient.getSession().catch(() => null),
      ]);

      let banner: string | null = null;
      let tab: 'send' | 'receive' = 'send';

      if (session) {
        if (session.activity.state === 'sending') {
          banner = "You're sending files. Finish or cancel to receive.";
          tab = 'send';
          get().startHeartbeat();
        } else if (session.activity.state === 'receiving') {
          banner = "You're receiving files. Finish or cancel to send.";
          tab = 'receive';
          get().startHeartbeat();
        }
      }

      set({ config, session, activityBanner: banner, activeTab: tab });
    } catch (err) {
      console.error('Init app error:', err);
    }
  },

  startHeartbeat: () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(async () => {
      try {
        await apiClient.heartbeat();
      } catch {
        // Ignore background heartbeat error
      }
    }, 20000);
  },

  stopHeartbeat: () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  },

  // Paywall
  paywallOpen: false,
  paywallPlanCode: 'standard',
  openPaywall: (planCode) => set({ paywallOpen: true, paywallPlanCode: planCode }),
  closePaywall: () => set({ paywallOpen: false }),

  // Send state
  sendStep: 'select',
  setSendStep: (sendStep) => set({ sendStep }),
  selectedFiles: [],
  hasFolder: false,

  addSelectedFiles: (newFiles, isFolder = false) => {
    const { selectedFiles } = get();
    const existing = new Set(selectedFiles.map((f) => f.path));
    const additions: SelectedFileItem[] = [];

    for (const item of newFiles) {
      if (!existing.has(item.path)) {
        existing.add(item.path);
        additions.push({
          id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          file: item.file,
          path: item.path,
        });
      }
    }

    const updated = [...selectedFiles, ...additions];
    set({
      selectedFiles: updated,
      hasFolder: get().hasFolder || isFolder,
      sendStep: updated.length > 0 ? 'review' : 'select',
    });

    // Trigger debounced quote evaluation
    if (quoteDebounceTimer) clearTimeout(quoteDebounceTimer);
    quoteDebounceTimer = setTimeout(() => {
      get().fetchQuote();
    }, 200);
  },

  removeSelectedFile: (id) => {
    const updated = get().selectedFiles.filter((f) => f.id !== id);
    set({
      selectedFiles: updated,
      sendStep: updated.length === 0 ? 'select' : get().sendStep,
    });

    if (quoteDebounceTimer) clearTimeout(quoteDebounceTimer);
    quoteDebounceTimer = setTimeout(() => {
      get().fetchQuote();
    }, 200);
  },

  clearSelectedFiles: () => {
    set({ selectedFiles: [], hasFolder: false, quote: null, sendStep: 'select' });
  },

  quote: null,
  isQuoting: false,

  fetchQuote: async () => {
    const { selectedFiles, hasFolder } = get();
    if (selectedFiles.length === 0) {
      set({ quote: null, isQuoting: false });
      return;
    }

    set({ isQuoting: true });
    try {
      const items = selectedFiles.map((f) => ({
        name: f.file.name,
        size: f.file.size,
        path: f.path,
        type: f.file.type || 'application/octet-stream',
      }));

      const quote = await apiClient.quote(items, hasFolder);
      set({ quote, isQuoting: false });
    } catch (err: any) {
      set({ isQuoting: false });
      if (err instanceof ApiError && err.code === 'TRANSFER_TOO_LARGE') {
        useToastStore.getState().showToast('Transfer exceeds 20 GB maximum limit', 'error');
      }
    }
  },

  uploadProgress: {
    percent: 0,
    speed: '0 MB/s',
    eta: '--:--',
    uploadedBytes: 0,
    totalBytes: 0,
  },
  createdTransferId: null,
  shareCode: null,
  codeExpiresAt: null,
  senderStatus: null,

  startUpload: async (senderName) => {
    const { selectedFiles, hasFolder } = get();
    if (selectedFiles.length === 0) return;

    set({ sendStep: 'uploading' });
    get().startHeartbeat();

    try {
      const items = selectedFiles.map((f) => ({
        name: f.file.name,
        size: f.file.size,
        path: f.path,
        type: f.file.type || 'application/octet-stream',
      }));

      const createRes = await apiClient.createTransfer(items, hasFolder, senderName);
      const transferId = createRes.transferId;
      set({ createdTransferId: transferId });

      const totalBytes = selectedFiles.reduce((acc, f) => acc + f.file.size, 0) || 1;
      let overallLoaded = 0;
      const startTime = Date.now();

      // Parallel queue with concurrency = 3
      const queue = createRes.items.map((mapping) => {
        const itemFile = selectedFiles[mapping.index];
        return { itemId: mapping.itemId, file: itemFile.file };
      });

      const uploadOne = async (item: { itemId: string; file: File }) => {
        let lastItemLoaded = 0;
        await apiClient.uploadItem(transferId, item.itemId, item.file, (loaded) => {
          const delta = loaded - lastItemLoaded;
          lastItemLoaded = loaded;
          overallLoaded += delta;

          const elapsedSec = (Date.now() - startTime) / 1000;
          const speedBps = elapsedSec > 0 ? overallLoaded / elapsedSec : 0;
          const speedMb = (speedBps / (1024 * 1024)).toFixed(1);
          const remainingBytes = Math.max(0, totalBytes - overallLoaded);
          const remainingSec = speedBps > 0 ? Math.round(remainingBytes / speedBps) : 0;
          const eta = `${Math.floor(remainingSec / 60)}:${(remainingSec % 60).toString().padStart(2, '0')}`;

          const percent = Math.min(100, Math.round((overallLoaded / totalBytes) * 100));
          set({
            uploadProgress: {
              percent,
              speed: `${speedMb} MB/s`,
              eta,
              uploadedBytes: overallLoaded,
              totalBytes,
            },
          });
        });
      };

      // Run concurrency = 3
      const worker = async () => {
        while (queue.length > 0) {
          const next = queue.shift();
          if (next) await uploadOne(next);
        }
      };

      await Promise.all([worker(), worker(), worker()]);

      // Complete transfer and get short-lived code
      const completeRes = await apiClient.completeTransfer(transferId);
      set({
        shareCode: completeRes.code,
        codeExpiresAt: completeRes.expiresAt,
        senderStatus: 'ready',
        sendStep: 'ready',
      });

      // Poll transfer status every 3s
      if (statusPollInterval) clearInterval(statusPollInterval);
      statusPollInterval = setInterval(async () => {
        try {
          const statusRes = await apiClient.getSenderStatus(transferId);
          set({ senderStatus: statusRes.state });
          if (['delivered', 'expired', 'cancelled'].includes(statusRes.state)) {
            clearInterval(statusPollInterval);
            get().stopHeartbeat();
          }
        } catch {
          // Ignore polling errors
        }
      }, 3000);

    } catch (err: any) {
      get().stopHeartbeat();
      if (err instanceof ApiError && err.code === 'ACTIVITY_IN_PROGRESS') {
        set({ activityBanner: err.message });
      } else {
        useToastStore.getState().showToast(err.message || 'Upload failed', 'error');
      }
      set({ sendStep: 'review' });
    }
  },

  cancelSending: async () => {
    const { createdTransferId } = get();
    if (createdTransferId) {
      try {
        await apiClient.cancelTransfer(createdTransferId);
      } catch {
        // Ignore cancel errors
      }
    }
    if (statusPollInterval) clearInterval(statusPollInterval);
    get().stopHeartbeat();
    get().resetSendFlow();
  },

  resetSendFlow: () => {
    set({
      sendStep: 'select',
      selectedFiles: [],
      hasFolder: false,
      quote: null,
      createdTransferId: null,
      shareCode: null,
      codeExpiresAt: null,
      senderStatus: null,
      uploadProgress: {
        percent: 0,
        speed: '0 MB/s',
        eta: '--:--',
        uploadedBytes: 0,
        totalBytes: 0,
      },
      activityBanner: null,
    });
  },

  // Receive state
  receiveStep: 'enter-code',
  setReceiveStep: (receiveStep) => set({ receiveStep }),
  code: '',
  setCode: (code) => set({ code }),
  isVerifying: false,
  verificationError: null,
  attemptsLeft: null,
  cooldownSeconds: null,
  verifiedTransfer: null,
  receiverStatus: null,

  verifyCode: async (code) => {
    set({ isVerifying: true, verificationError: null });
    try {
      const res = await apiClient.verifyCode(code);
      set({
        verifiedTransfer: res,
        receiveStep: 'preview',
        isVerifying: false,
      });
      get().startHeartbeat();

      // Poll receiver status every 2s to show downloaded items checkmark
      if (statusPollInterval) clearInterval(statusPollInterval);
      statusPollInterval = setInterval(async () => {
        try {
          const status = await apiClient.getReceiverStatus(res.transferId);
          set({ receiverStatus: status });
          if (status.state === 'delivered') {
            clearInterval(statusPollInterval);
            get().stopHeartbeat();
          }
        } catch {
          // Ignore status errors
        }
      }, 2000);

    } catch (err: any) {
      set({ isVerifying: false });
      if (err instanceof ApiError) {
        if (err.code === 'OWN_TRANSFER') {
          set({ verificationError: "You can't receive a transfer you're sending." });
          return;
        }
        if (err.code === 'ACTIVITY_IN_PROGRESS') {
          set({ activityBanner: err.message });
          return;
        }
        if (err.code === 'RATE_LIMITED') {
          const retryAfter = (err.extras?.retryAfterSec as number) || 60;
          set({
            verificationError: `Too many attempts. Locked for ${retryAfter} seconds.`,
            cooldownSeconds: retryAfter,
          });
          return;
        }
        if (err.code === 'INVALID_OR_EXPIRED_CODE') {
          const attempts = err.extras?.attemptsLeft as number;
          set({
            verificationError: attempts
              ? `That code isn't valid or has expired. ${attempts} attempt(s) left.`
              : "That code isn't valid or has expired.",
            attemptsLeft: attempts,
          });
          return;
        }
      }
      set({ verificationError: err.message || 'Verification failed.' });
    }
  },

  cancelReceiving: async () => {
    const { verifiedTransfer } = get();
    if (verifiedTransfer?.transferId) {
      try {
        await apiClient.abandonReceive(verifiedTransfer.transferId);
      } catch {
        // Ignore
      }
    }
    if (statusPollInterval) clearInterval(statusPollInterval);
    get().stopHeartbeat();
    get().resetReceiveFlow();
  },

  pollReceiverStatus: async () => {
    const { verifiedTransfer } = get();
    if (!verifiedTransfer?.transferId) return;
    try {
      const status = await apiClient.getReceiverStatus(verifiedTransfer.transferId);
      set({ receiverStatus: status });
    } catch {
      // Ignore
    }
  },

  resetReceiveFlow: () => {
    set({
      receiveStep: 'enter-code',
      code: '',
      isVerifying: false,
      verificationError: null,
      attemptsLeft: null,
      cooldownSeconds: null,
      verifiedTransfer: null,
      receiverStatus: null,
      activityBanner: null,
    });
  },
}));
