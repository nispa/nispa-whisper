import React from 'react';
import { X, Info, FileAudio, Settings2, Edit3, Download, Cpu } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export default function HelpModal({ isOpen, onClose, t }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Info size={24} className="text-blue-500" />
            Guida all'uso di WhisperApp
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 text-gray-300 leading-relaxed">
          
          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <FileAudio size={20} className="text-blue-400" />
              1. Caricamento e Modelli
            </h3>
            <p className="mb-3">
              WhisperApp supporta file audio e video (MP4, MOV, WAV, MP3, ecc.). Il file viene elaborato localmente sulla tua macchina, garantendo la massima privacy.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
              <li><strong className="text-gray-300">Tiny / Base:</strong> Modelli molto veloci, ideali per test o audio molto chiari.</li>
              <li><strong className="text-gray-300">Small / Medium:</strong> Il miglior compromesso tra velocità e precisione. <strong>Medium</strong> è il modello consigliato per la maggior parte degli usi.</li>
              <li><strong className="text-gray-300">Large-v3:</strong> La massima precisione possibile, ma richiede più tempo e più memoria video (VRAM).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Settings2 size={20} className="text-emerald-400" />
              2. Speaker Diarization
            </h3>
            <p className="mb-3">
              La "Diarization" è il processo che riconosce <em>chi</em> sta parlando. Se attivi questa opzione, l'app cercherà di separare le voci assegnando etichette come "Speaker 1", "Speaker 2", ecc.
            </p>
            <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg text-sm text-blue-200">
              <strong>Nota:</strong> Se il tuo audio contiene una sola persona, ti consigliamo di <strong>disattivare</strong> la Diarization per ottenere un risultato più pulito e un'elaborazione più veloce.
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Edit3 size={20} className="text-amber-400" />
              3. Editor e Correzioni
            </h3>
            <p className="mb-3">
              Una volta completata la trascrizione, entrerai nell'Editor.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
              <li>Clicca su qualsiasi blocco di testo per modificarlo.</li>
              <li>Il video/audio si sincronizzerà automaticamente con il testo selezionato.</li>
              <li>Usa la <strong>Waveform</strong> in basso a sinistra per navigare rapidamente nel file.</li>
              <li>Se hai attivato la Diarization, puoi cliccare sul nome dello speaker per rinominarlo (es. da "Speaker 1" a "Mario").</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Download size={20} className="text-purple-400" />
              4. Salvataggio ed Esportazione
            </h3>
            <p className="mb-3">
              Il tuo progetto viene salvato automaticamente nel browser. Puoi tornare alla schermata principale e riprenderlo in seguito.
            </p>
            <p className="text-sm text-gray-400">
              Clicca su <strong>ESPORTA SRT</strong> per scaricare il file dei sottotitoli, pronto per essere importato in Premiere Pro, DaVinci Resolve o YouTube.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Cpu size={20} className="text-red-400" />
              5. Requisiti Hardware
            </h3>
            <p className="text-sm text-gray-400">
              L'app utilizza l'accelerazione GPU (CUDA) se disponibile. Per usare il modello <strong>Large-v3</strong> è consigliata una scheda video NVIDIA con almeno 8GB di VRAM. Se la VRAM non è sufficiente, l'app scalerà automaticamente su modelli quantizzati (int8) o sulla CPU.
            </p>
          </section>

        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1a1a1a] flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
