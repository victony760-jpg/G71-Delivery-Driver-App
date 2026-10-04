import { useRef, useState } from 'react';
import api from '../../services/api.js';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  city: 'Lagos',
  bikeStatus: 'Own Bike',
  experience: 'Less than 1 year',
};

export default function CreateDriverForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [avatar, setAvatar] = useState(null);
  const avatarInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [avatarWarning, setAvatarWarning] = useState('');
  const [error, setError] = useState('');

  const updateField = (field, value) =>
    setForm((c) => ({ ...c, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAvatarWarning('');
    setError('');
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([field, value]) =>
        payload.append(field, value),
      );
      if (avatar) payload.append('avatar', avatar);
      const { data } = await api.post('/admin/users', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(initialForm);
      setAvatar(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      setMessage(
        data.temporaryPassword
          ? `${data.message} Temporary password: ${data.temporaryPassword}`
          : data.message || 'Driver account created.',
      );
      if (data.avatarUploadFailed)
        setAvatarWarning(
          'Driver account was created, but Cloudinary rejected the photo. Check the Cloudinary API key upload permissions before retrying the image.',
        );
      onCreated?.(data.user);
    } catch (createError) {
      setError(
        createError.response?.data?.message ||
        'Driver onboarding is not available from the backend yet.',
      );
    }
  };

  const inputClass =
    'w-full border border-black rounded-[12px] p-3 text-sm bg-white';

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-black rounded-[20px] md:rounded-[24px] p-4 md:p-6 grid gap-4"
    >
      <div>
        <p className="font-black text-[11px] tracking-[0.2em]">
          ADD DRIVER FROM APPLICATION
        </p>
        <p className="text-xs text-black/50 mt-1">Create a driver account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Full Name"
          className={inputClass}
          required
        />
        <input
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="WhatsApp Number"
          className={inputClass}
          required
        />
        <input
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="Login Email"
          type="email"
          className={inputClass}
          required
        />
        <select
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
          className={inputClass}
        >
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Port Harcourt</option>
          <option>Ibadan</option>
          <option>Kano</option>
        </select>
        <select
          value={form.bikeStatus}
          onChange={(e) => updateField('bikeStatus', e.target.value)}
          className={inputClass}
        >
          <option>Own Bike</option>
          <option>Need Company Bike (HP)</option>
        </select>
      </div>

      <select
        value={form.experience}
        onChange={(e) => updateField('experience', e.target.value)}
        className={inputClass}
      >
        <option>Less than 1 year</option>
        <option>1-2 years</option>
        <option>3+ years</option>
      </select>

      <label className="grid gap-2 text-sm font-semibold">
        Driver profile photo (optional)
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => setAvatar(event.target.files?.[0] || null)}
          className={inputClass}
        />
        <span className="text-xs font-normal text-black/50">
          JPG or PNG, up to 5 MB.
          {avatar ? ` Selected: ${avatar.name}` : ''}
        </span>
      </label>

      <button className="bg-black text-white rounded-full py-3 font-black text-xs tracking-widest w-full">
        ADD DRIVER
      </button>
      {message && (
        <p className="text-green-700 text-xs font-semibold">{message}</p>
      )}
      {avatarWarning && (
        <p role="status" className="text-amber-700 text-xs font-semibold">
          {avatarWarning}
        </p>
      )}
      {error && <p role="alert" className="text-red-600 text-xs font-semibold">{error}</p>}
    </form>
  );
}
