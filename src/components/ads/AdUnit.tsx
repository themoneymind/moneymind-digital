
import React, { useEffect } from 'react';

// Define the global adsbygoogle property for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid';
  style?: React.CSSProperties;
  responsive?: boolean;
  className?: string;
}

export const AdUnit = ({ 
  slot, 
  format = 'auto', 
  style = {}, 
  responsive = true,
  className = '' 
}: AdUnitProps) => {
  useEffect(() => {
    try {
      // Force AdSense to render
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="YOUR-ADSENSE-CLIENT-ID" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};
