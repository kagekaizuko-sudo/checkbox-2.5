// components/avatar-selector.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=1',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=2',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=3',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=4',
  'https://api.dicebear.com/7.x/initials/svg?seed=John',
  'https://api.dicebear.com/7.x/initials/svg?seed=Sarah',
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
}

export function AvatarSelector({ selectedAvatar, onAvatarSelect }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div 
        className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        {selectedAvatar ? (
          <Image
            src={selectedAvatar}
            alt="Selected Avatar"
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="text-gray-400 text-sm text-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-1"></div>
            <span className="text-xs">Choose</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Choose Avatar</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onAvatarSelect(avatar);
                    setIsOpen(false);
                  }}
                  className={`w-16 h-16 rounded-full border-2 transition-colors ${
                    selectedAvatar === avatar
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Image
                    src={avatar}
                    alt={`Avatar option ${index + 1}`}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
