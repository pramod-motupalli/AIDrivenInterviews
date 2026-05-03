import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UploadBox({ icon, title, description, onFileSelect, loading, success }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <Card 
      onClick={handleClick}
      className={`bg-white border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/30 group hover:border-primary/40 transition-colors cursor-pointer ${
        success ? 'border-green-400 bg-green-50/20' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx"
      />
      <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm mb-4 group-hover:text-primary transition-colors ${
        success ? 'text-green-600 border-green-200' : ''
      }`}>
        <span className="material-symbols-outlined">{success ? 'check_circle' : icon}</span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{success ? 'File Selected' : title}</h3>
      <p className="text-body-sm text-slate-500 text-center mb-4 truncate max-w-full px-2">
        {success ? success : description}
      </p>
      <Button 
        variant={success ? "secondary" : "outline"}
        disabled={loading}
        className="bg-white border-slate-200 hover:bg-slate-50 pointer-events-none"
      >
        {loading ? 'Uploading...' : success ? 'Change File' : 'Choose File'}
      </Button>
    </Card>
  );
}
