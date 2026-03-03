import React, { useRef, useEffect } from 'react';
import { Edit3, MoreVertical } from 'lucide-react';
import { Segment } from '../../types';
import { useEditor } from './EditorContext';

interface SegmentItemProps {
  segment: Segment;
  index: number;
  t: (key: string) => string;
}

const SegmentItem = React.memo(({ segment, index, t }: SegmentItemProps) => {
  const { 
    activeSegmentId, 
    editingId, 
    setActiveSegmentId, 
    setEditingId, 
    handleTextChange, 
    handleSeek,
    setIsPlaying,
    modifiedIds
  } = useEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId === segment.id && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [editingId, segment.id]);

  const isActive = activeSegmentId === segment.id;
  const isEditing = editingId === segment.id;
  const isModified = modifiedIds.has(segment.id);

  const handleSegmentSelect = () => {
    setActiveSegmentId(segment.id);
    handleSeek(segment.start);
    setIsPlaying(true);
  };

  const formatTime = (s: number) => new Date(s * 1000).toISOString().substr(14, 5);

  return (
    <div 
      id={`segment-${segment.id}`}
      className={`flex gap-6 p-5 rounded-xl border transition-all cursor-text group relative
        ${isActive ? 'bg-[#1e1e1e] border-gray-700 shadow-xl' : 'bg-transparent border-transparent hover:bg-gray-800/40'}`}
      onClick={handleSegmentSelect}
    >
      <div className="w-36 shrink-0 flex flex-col gap-2 select-none pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 bg-gray-900/50 px-2 py-1 rounded w-fit">
            [{index + 1}] {formatTime(segment.start)}
          </span>
          {isModified && (
            <span className="text-[10px] font-bold uppercase tracking-tight text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Modificato
            </span>
          )}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600 pb-1">{t('editor.text')}</span>
      </div>

      <div className="flex-1 relative">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={segment.text}
            onChange={(e) => {
              handleTextChange(segment.id, e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onBlur={() => setEditingId(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setEditingId(null);
              }
              if (e.key === 'Escape') {
                setEditingId(null);
              }
            }}
            className="w-full bg-gray-900 border border-blue-500 rounded-lg p-3 text-gray-200 font-serif text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none overflow-hidden shadow-inner"
            rows={1}
          />
        ) : (
          <div 
            className="text-gray-300 font-serif text-lg leading-relaxed hover:text-white transition-colors py-2 px-1 rounded cursor-text"
            onClick={() => setEditingId(segment.id)}
          >
            {segment.text}
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#2a2a2a] rounded-lg border border-gray-700 p-1 z-10">
          <button 
            className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white" 
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(segment.id);
            }}
          >
            <Edit3 size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default SegmentItem;
