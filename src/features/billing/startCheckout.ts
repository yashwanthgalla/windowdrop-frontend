import { apiClient, ApiError } from '../../api/client';
import { useToastStore } from '../../store/useToastStore';

/**
 * Initiates direct subscription upgrade and entitlement activation.
 */
export async function startCheckout(planCode: string): Promise<void> {
  const showToast = useToastStore.getState().showToast;

  try {
    showToast('Initiating subscription upgrade...', 'info');
    const order = await apiClient.createOrder(planCode);

    showToast('Activating subscription entitlement...', 'info');
    const verifyRes = await apiClient.verifyOrder(order.orderId);

    if (verifyRes.success) {
      showToast('Plan activated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Subscription processing. Please refresh in a moment.', 'info');
    }
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
