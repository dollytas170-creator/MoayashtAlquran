import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, CheckCircle2, X, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSurahName?: string;
  defaultVerses?: string;
  taskId?: string;
}

export const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  isOpen,
  onClose,
  defaultSurahName = 'سورة العلق',
  defaultVerses = 'الآيات 1 - 5',
  taskId,
}) => {
  const { activeStudent, submitStudentAudio } = useApp();
  const [surahName, setSurahName] = useState(defaultSurahName);
  const [versesRange, setVersesRange] = useState(defaultVerses);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadTab, setUploadTab] = useState<'record' | 'file'>('record');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (defaultSurahName) setSurahName(defaultSurahName);
    if (defaultVerses) setVersesRange(defaultVerses);
  }, [defaultSurahName, defaultVerses]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    };
  }, [audioBlobUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access not available or permission denied. Enabling simulation mode.', err);
      // Fallback simulated recording
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // simulated blob
      setAudioBlobUrl('simulated_audio_recording');
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    if (audioBlobUrl && audioBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    setAudioBlobUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current && audioBlobUrl) {
      const audio = new Audio(audioBlobUrl);
      audioPlayerRef.current = audio;
      audio.onended = () => setIsPlaying(false);
    }

    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play().catch(() => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioBlobUrl(url);
      setRecordingDuration(60);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) {
      alert('يرجى اختيار الطالب أولاً');
      return;
    }
    if (!audioBlobUrl) {
      alert('يرجى تسجيل الصوت أو رفع ملف صوتي أولاً');
      return;
    }

    submitStudentAudio({
      studentId: activeStudent.id,
      surahName,
      versesRange,
      audioUrl: audioBlobUrl,
      audioDurationSeconds: recordingDuration || 45,
      taskId,
    });

    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">تسجيل / رفع التسميع القرآني</h3>
            <p className="text-xs text-stone-500">سجل صوتك بوضوح وتأنٍ ليراجعه معلم التحفيظ</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">اسم السورة</label>
              <input
                type="text"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="مثال: سورة العلق"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">نطاق الآيات</label>
              <input
                type="text"
                value={versesRange}
                onChange={(e) => setVersesRange(e.target.value)}
                placeholder="مثال: الآيات 1 إلى 5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                required
              />
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setUploadTab('record')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                uploadTab === 'record' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              تسجيل صوتي مباشر
            </button>
            <button
              type="button"
              onClick={() => setUploadTab('file')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                uploadTab === 'file' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              رفع ملف صوتي مسجل
            </button>
          </div>

          {/* Recorder View */}
          {uploadTab === 'record' ? (
            <div className="border border-stone-200 rounded-2xl p-6 bg-stone-50/50 flex flex-col items-center justify-center text-center">
              {!audioBlobUrl ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="relative">
                    {isRecording && (
                      <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></span>
                    )}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                        isRecording ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                  </div>

                  <div>
                    <div className="text-2xl font-mono font-bold text-stone-800">
                      {formatTime(recordingDuration)}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {isRecording ? 'جاري التسجيل... اضغط المربع للإيقاف' : 'اضغط المايك لبدء التسميع'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تم تسجيل التسميع بنجاح ({formatTime(recordingDuration)})</span>
                  </div>

                  {/* Visualizer Bar Simulation */}
                  <div className="h-10 bg-emerald-50 rounded-xl flex items-center justify-center px-4 gap-1 border border-emerald-200">
                    {[35, 60, 45, 90, 75, 40, 65, 80, 50, 70, 85, 30, 95, 60, 40, 75, 55, 30].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-400'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-medium text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'إيقاف الاستماع' : 'استمع لتسجيلك'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetRecording}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-300 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة التسجيل</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-stone-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Volume2 className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700 mb-1">اختر ملف صوتي من جهازك</p>
              <p className="text-xs text-stone-500 mb-4">صيغ مدعومة: MP3, WAV, M4A, OGG</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                تصفح الملفات
              </button>
              {audioBlobUrl && (
                <p className="mt-3 text-xs text-emerald-700 font-medium">✓ تم اختيار الملف الصوتي بنجاح</p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!audioBlobUrl}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                audioBlobUrl
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              إرسال التسميع للمحفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
