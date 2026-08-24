import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { api, messageFromError } from '../lib/api.js';

export default function UploadButton({ type = 'video', onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setError(''); setUploading(true);
    try {
      const { data } = await api.get(`/uploads/signature?type=${type}`);
      const signature = data.data;
      const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`;
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signature.apiKey);
      form.append('timestamp', signature.timestamp);
      form.append('signature', signature.signature);
      form.append('folder', signature.folder);
      const result = await fetch(endpoint, { method: 'POST', body: form });
      if (!result.ok) throw new Error('Cloud upload failed.');
      const asset = await result.json();
      onUploaded({ url: asset.secure_url, publicId: asset.public_id, duration: asset.duration || null });
    } catch (e) { setError(messageFromError(e)); } finally { setUploading(false); }
  };

  return <div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"><UploadCloud size={17}/>{uploading ? 'Uploading...' : type === 'video' ? 'Upload Video' : 'Upload Photo'}<input type="file" hidden accept={type === 'video' ? 'video/*' : 'image/*'} disabled={uploading} onChange={(e) => upload(e.target.files?.[0])}/></label>{error && <p className="mt-2 text-sm text-rose-300">{error}</p>}</div>;
}
