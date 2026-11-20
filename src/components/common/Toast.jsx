import { useEffect } from 'react';
import { useData } from '../../context/DataContext';

export default function Toast() {
  const { toastMessage, hideToast } = useData();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage, hideToast]);

  return (
    <div
      id="toast"
      className={`toast ${toastMessage ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {toastMessage}
    </div>
  );
}
