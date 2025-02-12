import React, { useEffect } from 'react';
import './AddressSearch.css';

interface AddressData {
  address: string;
  zonecode: string;
  buildingName?: string;
}

interface AddressSearchProps {
  onComplete: (data: AddressData) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: AddressData) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onComplete, onClose }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    
    script.onload = () => {
      new window.daum.Postcode({
        oncomplete: (data: AddressData) => {
          onComplete({
            address: data.address,
            zonecode: data.zonecode,
            buildingName: data.buildingName
          });
          if (onClose) onClose();
        },
        onclose: onClose
      }).embed(document.getElementById('address-search-container')!);
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onComplete, onClose]);

  return (
    <div className="address-search-modal">
      <div className="address-search-content">
        <div className="address-search-header">
          <h3>주소 검색</h3>
          {onClose && (
            <button onClick={onClose} className="close-button">
              ✕
            </button>
          )}
        </div>
        <div id="address-search-container" style={{ height: '400px' }}></div>
      </div>
    </div>
  );
};

export default AddressSearch; 