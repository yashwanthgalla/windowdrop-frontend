import { apiClient, ApiError } from '../../api/client';
import { useToastStore } from '../../store/useToastStore';

declare global {
  interface Window {
    Razorpay?: new (options: any) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_modal' | '_blank';
      }) => Promise<{
        error?: { message: string; code?: string };
        paymentDetails?: { paymentMessage: string };
      }>;
    };
  }
}

/**
 * Loads the Razorpay Checkout SDK dynamically if not already present.
 */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay === 'function') {
      resolve();
      return;
    }

    const existingScript = document.getElementById('razorpay-js-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-js-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK script'));
    document.head.appendChild(script);
  });
}

/**
 * Initiates checkout via Razorpay Payments (with fallback to dev mode).
 */
export async function startCheckout(planCode: string): Promise<void> {
  const showToast = useToastStore.getState().showToast;

  try {
    showToast('Initializing secure Razorpay payment...', 'info');
    const order = await apiClient.createOrder(planCode) as any;

    // Dev test session: if test keys are active or order is local test
    if (order.razorpayKeyId?.startsWith('rzp_test_dropcode') || order.paymentSessionId?.startsWith('order_dev_')) {
      showToast('Test Gateway: Activating subscription entitlement...', 'info');
      const verifyRes = await apiClient.verifyOrder(order.orderId);
      if (verifyRes.success) {
        showToast('Plan activated successfully!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
      return;
    }

    // Load Razorpay SDK
    await loadRazorpayScript();

    if (!window.Razorpay) {
      // Fallback verification if script blocked
      const verifyRes = await apiClient.verifyOrder(order.orderId);
      if (verifyRes.success) {
        showToast('Plan activated successfully!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
      return;
    }

    const options = {
      key: order.razorpayKeyId || 'rzp_test_dropcode123',
      amount: order.amountPaise,
      currency: order.currency || 'INR',
      name: 'DropCode Cloud',
      description: `Annual ${order.planCode.toUpperCase()} Plan Subscription`,
      order_id: order.razorpayOrderId || order.orderId,
      handler: async function (response: any) {
        try {
          showToast('Verifying payment signature with Razorpay...', 'info');
          const verifyRes = await (apiClient as any).verifyOrder({
            orderId: order.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            showToast('Payment successful! Your DropCode plan is now active.', 'success');
            setTimeout(() => window.location.reload(), 1200);
          } else {
            showToast('Payment processing. Please refresh in a moment.', 'info');
          }
        } catch (err: any) {
          showToast(err.message || 'Signature verification failed', 'error');
        }
      },
      theme: {
        color: '#0071E3',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err: unknown) {
    if (err instanceof ApiError && err.code === 'LOGIN_REQUIRED') {
      showToast('Please sign in to upgrade your plan', 'error');
      window.location.href = '/auth?next=/plan';
      return;
    }

    const message = err instanceof Error ? err.message : 'Unable to complete checkout';
    showToast(message, 'error');
    console.error('Checkout failed:', err);
  }
}
