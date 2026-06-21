import React, { useState } from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, message, type = 'confirm', placeholder = '' }) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
      setInputValue('');
    } else {
      onConfirm();
    }
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 mb-6">{message}</p>

        {type === 'prompt' && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors mb-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm();
            }}
          />
        )}

        <div className="flex gap-3 justify-end">
          <button 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#f72585] text-white hover:shadow-[0_0_15px_rgba(247,37,133,0.4)] transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
