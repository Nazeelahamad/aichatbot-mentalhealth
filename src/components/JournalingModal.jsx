import { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';

export default function JournalingModal({ onSave, onClose, isSaving }) {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const content = entry.trim();
    if (!content) {
      setError('Please write an entry before saving.');
      return;
    }

    setError('');
    const result = await onSave(content);
    if (!result) setError('Your entry could not be saved. Please try again.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <h3 className="text-xl font-bold">Journal Entry</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">
              What made you smile today? What are you grateful for?
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Entries are visible only in your signed-in account. Avoid including information you would not want stored.
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Share your thoughts..."
              rows={8}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
