import { useState, useRef, useCallback } from 'react';
import { Camera, Video, X, CheckCircle, AlertCircle, Loader2, ImagePlus, Film, CloudUpload } from 'lucide-react';
import { uploadImages, uploadVideos, uploadLargeFile } from '@/services/api';
import { useMediaStore } from '@/stores/media';

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImages, addVideos } = useMediaStore();

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + 'KB';
    return bytes + 'B';
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = activeTab === 'images'
      ? fileArray.filter(f => f.type.startsWith('image/'))
      : fileArray.filter(f => f.type.startsWith('video/'));
    
    if (validFiles.length === 0) {
      alert(`请选择${activeTab === 'images' ? '图片' : '视频'}文件`);
      return;
    }

    const newTasks: UploadTask[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      file,
      progress: 0,
      status: 'pending',
      preview: activeTab === 'images' ? URL.createObjectURL(file) : undefined,
    }));
    
    setTasks(prev => [...newTasks, ...prev]);
    
    // 逐个上传
    for (const task of newTasks) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'uploading' } : t));
      
      try {
        let result;
        const isLargeFile = task.file.size > 100 * 1024 * 1024;
        
        if (isLargeFile && activeTab === 'videos') {
          result = await uploadLargeFile(task.file, (percent) => {
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: percent } : t));
          });
        } else {
          if (activeTab === 'images') {
            result = await uploadImages([task.file]);
          } else {
            result = await uploadVideos([task.file]);
          }
        }
        
        if (result.success && result.items) {
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, status: 'success', progress: 100 } : t
          ));
          if (activeTab === 'images') {
            addImages(result.items);
          } else {
            addVideos(result.items);
          }
        } else {
          throw new Error(result.error || '上传失败');
        }
      } catch (error) {
        setTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, status: 'error', error: (error as Error).message } : t
        ));
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [activeTab, addImages, addVideos]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeTask = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task?.preview) URL.revokeObjectURL(task.preview);
      return prev.filter(t => t.id !== id);
    });
  };

  const successCount = tasks.filter(t => t.status === 'success').length;
  const errorCount = tasks.filter(t => t.status === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 标题 */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
            <CloudUpload className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">快速上传</h1>
          <p className="text-gray-500 text-sm mt-1">从手机相册批量上传图片和视频</p>
        </div>

        {/* Tab切换 */}
        <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
              activeTab === 'images'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Camera className="w-5 h-5" />
            图片
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Video className="w-5 h-5" />
            视频
          </button>
        </div>

        {/* 上传按钮 - 大按钮设计，适合手机点击 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-white rounded-2xl shadow-sm p-8 text-center cursor-pointer active:scale-95 transition-transform"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={activeTab === 'images' ? 'image/*' : 'video/*'}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            activeTab === 'images' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {activeTab === 'images' ? (
              <ImagePlus className="w-10 h-10 text-green-600" />
            ) : (
              <Film className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-800">
            点击选择{activeTab === 'images' ? '图片' : '视频'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            支持从相册批量选择
          </p>
          {activeTab === 'videos' && (
            <p className="text-blue-600 text-xs mt-2">
              支持大视频文件(1GB-5GB)，自动分片上传
            </p>
          )}
        </div>

        {/* 统计信息 */}
        {(successCount > 0 || errorCount > 0) && (
          <div className="flex gap-3 mt-4">
            {successCount > 0 && (
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-xs text-green-600">上传成功</p>
              </div>
            )}
            {errorCount > 0 && (
              <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                <p className="text-xs text-red-600">上传失败</p>
              </div>
            )}
            <button
              onClick={() => setTasks([])}
              className="px-4 bg-gray-100 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-200"
            >
              清空列表
            </button>
          </div>
        )}

        {/* 上传任务列表 */}
        {tasks.length > 0 && (
          <div className="mt-4 space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                {/* 预览图 */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {task.preview ? (
                    <img src={task.preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{task.file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(task.file.size)}</p>
                  
                  {task.status === 'uploading' && (
                    <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}
                  {task.status === 'success' && (
                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 上传成功
                    </p>
                  )}
                  {task.status === 'error' && (
                    <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {task.error}
                    </p>
                  )}
                </div>

                {/* 状态图标 */}
                <div className="flex-shrink-0">
                  {task.status === 'uploading' && <Loader2 className="w-5 h-5 text-green-500 animate-spin" />}
                  {task.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {task.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  {(task.status === 'success' || task.status === 'error') && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
