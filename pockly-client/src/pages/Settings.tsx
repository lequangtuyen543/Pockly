import { PageContainer } from '@/components/shared/PageContainer';
import { SettingsForm } from './components/SettingsForm';
import { PreferencesSection } from './components/PreferencesSection';

const SettingsPage = () => {
  return (
    <PageContainer>
      {/* Settings Header */}
      <div className="mb-xl">
        <h1 className="font-headline-md text-headline-md" style={{ color: '#c96442' }}>Settings</h1>
        <p className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>Manage your Pockly preferences and data.</p>
      </div>

      {/* Export Data Section */}
      <SettingsForm />

      {/* Other Settings Section */}
      <PreferencesSection />

      {/* Tip Card */}
      <div className="mt-xl grid grid-cols-12 gap-gutter">
        <div className="col-span-12 bg-[#faf9f5] border border-[#e8e6dc] rounded-xl p-lg ring-1 ring-black/5 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline-md text-title-sm" style={{ color: '#c96442' }}>Tip</h3>
            <p className="font-body-sm text-body-sm max-w-[70%]" style={{ color: '#5f5e5a' }}>
              Regularly exporting your data helps ensure you never lose your financial history.
            </p>
          </div>
          <span
            className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-stone-100 opacity-50 pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lightbulb
          </span>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;