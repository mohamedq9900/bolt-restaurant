import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getSettings, saveSettings, SiteSettings } from '../../data/settingsData';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      saveSettings(settings);
      setSaveMessage('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'deliveryFee' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">إعدادات الموقع</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="restaurantName" className="label">
                اسم المطعم
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={settings.restaurantName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="heroTitle" className="label">
                عنوان الصفحة الرئيسية
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="label">
                النص التوضيحي للصفحة الرئيسية
              </label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                className="input"
                rows={2}
                required
              />
            </div>

            <div>
              <label htmlFor="aboutText" className="label">
                نص "من نحن"
              </label>
              <textarea
                id="aboutText"
                name="aboutText"
                value={settings.aboutText}
                onChange={handleChange}
                className="input"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">معلومات الاتصال والتوصيل</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="label">
                العنوان
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                رقم الهاتف
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="workingHours" className="label">
                ساعات العمل
              </label>
              <input
                type="text"
                id="workingHours"
                name="workingHours"
                value={settings.workingHours}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="taxNumber" className="label">
                الرقم الضريبي
              </label>
              <input
                type="text"
                id="taxNumber"
                name="taxNumber"
                value={settings.taxNumber}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="deliveryFee" className="label">
                رسوم التوصيل (بالدينار العراقي)
              </label>
              <input
                type="number"
                id="deliveryFee"
                name="deliveryFee"
                value={settings.deliveryFee}
                onChange={handleChange}
                className="input"
                min="0"
                step="500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          {saveMessage && (
            <p className={`text-sm ${
              saveMessage.includes('خطأ') ? 'text-accent-600' : 'text-secondary-600'
            }`}>
              {saveMessage}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary flex items-center"
            disabled={isSaving}
          >
            <Save className="h-5 w-5 ml-2" />
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;