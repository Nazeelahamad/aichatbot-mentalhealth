import { BookOpen, CalendarDays, Plus, Trash2 } from 'lucide-react';

const formatEntryDate = (value) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
}).format(new Date(value));

export default function Journal({ entries, onNewEntry, onDelete }) {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Journal</h2>
              <p className="text-sm text-gray-600">A private space to reflect on your day.</p>
            </div>
          </div>
          <button
            onClick={onNewEntry}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New entry
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
          <BookOpen className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No entries yet</h3>
          <p className="text-gray-600 mt-1">Write down a thought, a feeling, or something you are grateful for.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex gap-4 justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <CalendarDays className="w-4 h-4" />
                    <time dateTime={entry.createdAt}>{formatEntryDate(entry.createdAt)}</time>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">{entry.content}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(entry._id)}
                  aria-label="Delete journal entry"
                  className="shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
