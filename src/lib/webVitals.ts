import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

type MetricHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: MetricHandler) => {
  if (onPerfEntry) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export const sendToAnalytics = ({ name, value, id }: Metric) => {
  if (typeof window !== 'undefined') {
    const win = window as Window & { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', name, {
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_label: id,
        non_interaction: true,
      });
    }
  }
};

export default reportWebVitals;
