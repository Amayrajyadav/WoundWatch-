import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_IMAGES } from '@/data/demoCase';

interface CameraCaptureProps {
  capturedImage: string | null;
  onImageCaptured: (imageSrc: string) => void;
  onNextStep: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  capturedImage,
  onImageCaptured,
  onNextStep,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your current browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please enable camera access in browser settings, or use Upload / Synthetic Demo Mode.'
          : 'Unable to access rear camera. Please use file upload or demo mode.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onImageCaptured(dataUrl);
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageCaptured(event.target.result as string);
          stopCameraStream();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemo = () => {
    stopCameraStream();
    onImageCaptured(DEMO_IMAGES.day1);
  };

  const handleRetake = () => {
    onImageCaptured('');
    startCamera();
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Preview Frame */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border-2 border-surface-border dark:border-surface-darkBorder shadow-xl flex items-center justify-center">
        {capturedImage ? (
          /* Captured Image Preview */
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Recovery Observation"
              className="w-full h-full object-cover"
            />
            {/* Watermark overlay if demo image */}
            {capturedImage.includes('SYNTHETIC') && (
              <div className="absolute bottom-3 left-3 right-3 bg-surface-dark/95 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-500/40 text-center">
                <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-brand-300 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span>SYNTHETIC DEMO IMAGE — NOT A REAL CLINICAL PHOTO</span>
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 backdrop-blur-sm shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image Captured</span>
            </div>
          </div>
        ) : isCameraActive ? (
          /* Live Camera View */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Corner Framing Markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brand-400 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brand-400 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brand-400 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brand-400 pointer-events-none" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-brand-400/80 border-dashed animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-brand-500/50" />
              </div>
            </div>
            <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Rear Camera Active</span>
            </div>
          </div>
        ) : (
          /* Initial Standby / Fallback UI */
          <div className="p-6 text-center text-slate-300 flex flex-col items-center justify-center space-y-4">
            {cameraError ? (
              <div className="max-w-xs space-y-2">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-amber-200">{cameraError}</p>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
            )}

            <div>
              <p className="font-bold text-white text-base">Capture Recovery Observation</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Position camera consistently under bright, steady illumination.
              </p>
            </div>

            {!cameraError && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="bg-brand-500 hover:bg-brand-600 text-white px-7 py-3 rounded-full font-bold text-sm shadow-subtle flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Open Rear Camera</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Camera Action Buttons */}
      <div className="space-y-2.5">
        {capturedImage ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3.5 px-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder bg-white dark:bg-surface-darkSoft text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>
            <button
              onClick={onNextStep}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-subtle hover:shadow-glow transition-all"
            >
              <span>Continue to Context</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {isCameraActive && (
              <button
                onClick={capturePhoto}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-glow flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Photo</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-3 rounded-2xl border border-surface-border dark:border-surface-darkBorder bg-white dark:bg-surface-darkSoft text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Upload className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Upload File</span>
              </button>

              <button
                onClick={handleUseDemo}
                className="py-3 px-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 hover:bg-brand-100 dark:hover:bg-brand-900 transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Demo Case</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
