import React, { useEffect } from 'react';

export default function Trade() {
  useEffect(() => {
    const loadWidget = async () => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@okx/dex-widget@latest/dist/index.umd.js';
      script.async = true;
      script.onload = () => {
        if (window.OKXDexWidget) {
          new window.OKXDexWidget({
            elementId: 'okx-widget-container',
            network: 1,
            width: '100%',
            height: '600px'
          });
        }
      };
      document.body.appendChild(script);
    };

    loadWidget();

    return () => {
      const script = document.querySelector('script[src="https://unpkg.com/@okx/dex-widget@latest/dist/index.umd.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div id="okx-widget-container"></div>
    </div>
  );
}