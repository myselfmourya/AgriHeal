import React from 'react';
import { useConsent } from '../../contexts/ConsentContext';
import { ShieldCheck, MapPin, Mic, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ConsentModal() {
  const { showConsentModal, pendingConsentType, grantConsent, denyConsent } = useConsent();
  const { t } = useTranslation();

  if (!showConsentModal || !pendingConsentType) return null;

  const getConsentDetails = () => {
    switch (pendingConsentType) {
      case 'location':
        return {
          icon: <MapPin className="w-8 h-8 text-green-500" />,
          title: t('consent.location.title', 'Allow Location Access'),
          description: t('consent.location.desc', 'We need your location to provide accurate weather forecasts and local market prices. You can change this later in Settings.')
        };
      case 'microphone':
        return {
          icon: <Mic className="w-8 h-8 text-blue-500" />,
          title: t('consent.microphone.title', 'Allow Microphone Access'),
          description: t('consent.microphone.desc', 'Vani AI needs microphone access to hear your voice commands. We only listen when you activate voice mode.')
        };
      case 'camera':
        return {
          icon: <Camera className="w-8 h-8 text-purple-500" />,
          title: t('consent.camera.title', 'Allow Camera Access'),
          description: t('consent.camera.desc', 'We need camera access to analyze crop diseases from your photos.')
        };
      case 'dataSharing':
        return {
          icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
          title: t('consent.data.title', 'Data Sharing Consent'),
          description: t('consent.data.desc', 'Allow us to securely use your farm data to provide personalized AI recommendations. Your data is encrypted and never sold.')
        };
      default:
        return {
          icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
          title: t('consent.default.title', 'Permission Required'),
          description: t('consent.default.desc', 'We need your permission to enable this feature.')
        };
    }
  };

  const details = getConsentDetails();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              {details.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {details.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              {details.description}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => grantConsent(pendingConsentType)}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
              >
                {t('common.allow', 'Allow')}
              </button>
              
              <button
                onClick={() => denyConsent(pendingConsentType)}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors"
              >
                {t('common.deny', 'Not Now')}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
            <ShieldCheck className="w-4 h-4 inline-block mr-1 opacity-70" />
            {t('consent.footer', 'You can manage permissions in Settings anytime.')}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
