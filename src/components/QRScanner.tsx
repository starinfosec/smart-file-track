import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Zap, ZapOff, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface QRScannerProps {
  onResult: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onResult, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      setIsScanning(true);

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            // Stop scanning immediately to prevent multiple triggers
            if (html5QrCode.isScanning) {
              await html5QrCode.stop();
            }
            setIsScanning(false);
            onResult(decodedText);
          } catch (err) {
            console.error("Error handling scan result:", err);
            // Even if stop fails, we should try to notify the parent
            onResult(decodedText);
            setIsScanning(false);
          }
        },
        (errorMessage) => {
          // Ignore frequent scan errors
        }
      );

      // Check for flash capability
      const track = typeof (html5QrCode as any).getRunningTrack === 'function' 
        ? (html5QrCode as any).getRunningTrack() 
        : null;
        
      if (track) {
        const capabilities = typeof track.getCapabilities === 'function' 
          ? track.getCapabilities() 
          : {};
        setHasFlash(!!(capabilities as any).torch);
      }
    } catch (err) {
      console.error(err);
      onError?.(String(err));
      setIsScanning(false);
    }
  };

  const toggleFlash = async () => {
    if (!scannerRef.current) return;
    try {
      const constraints = {
        advanced: [{ torch: !flashOn }]
      };

      // Try using applyVideoConstraints if available (standard in newer html5-qrcode)
      if (typeof (scannerRef.current as any).applyVideoConstraints === 'function') {
        await (scannerRef.current as any).applyVideoConstraints(constraints);
        setFlashOn(!flashOn);
      } else {
        // Fallback to direct track manipulation
        const track = typeof (scannerRef.current as any).getRunningTrack === 'function'
          ? (scannerRef.current as any).getRunningTrack()
          : null;
          
        if (track && typeof track.applyConstraints === 'function') {
          await track.applyConstraints(constraints);
          setFlashOn(!flashOn);
        }
      }
    } catch (err) {
      console.error("Flash toggle error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
        <div id="reader" className="w-full h-full"></div>
        
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white p-8 text-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/20">
              <Camera className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ready to Scan</h3>
            <p className="text-gray-300 text-sm mb-8">Position the QR code within the frame to track the file movement.</p>
            <button
              onClick={startScanner}
              className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Start Camera
            </button>
          </div>
        )}

        {isScanning && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-yellow-400 rounded-2xl">
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                />
              </div>
            </div>
            
            {hasFlash && (
              <button
                onClick={toggleFlash}
                className="absolute bottom-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
              >
                {flashOn ? <ZapOff className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </button>
            )}
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        System Online & Ready
      </div>
    </div>
  );
}
