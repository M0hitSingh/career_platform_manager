import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageBuilderProvider, usePageBuilder } from '../../context/PageBuilderContext';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PreviewModal from './PreviewModal';
import ToastContainer from '../common/ToastContainer';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PageBuilderContent = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  const { 
    updateBranding, 
    selectedComponent, 
    publishCareerPage, 
    saveCareerPage,
    loadCareerPageFromAPI,
    isPublishing, 
    isSaving,
    hasUnsavedChanges,
    isPublished,
    setCompanySlug
  } = usePageBuilder();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.company?.branding) {
      updateBranding(user.company.branding);
    }
    if (user?.company?.slug) {
      setCompanySlug(user.company.slug);
    }
  }, [user, updateBranding, setCompanySlug]);

  // Warn user about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load career page data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadCareerPageFromAPI();
      } catch (error) {
        console.error('Failed to load career page data:', error);
      }
    };

    if (user) {
      loadInitialData();
    }
  }, [user, loadCareerPageFromAPI]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || isSaving || isPublishing) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        await saveCareerPage();
        console.log('Auto-saved career page');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 30000); // Auto-save after 30 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, isSaving, isPublishing, saveCareerPage]);

  const handlePublish = async () => {
    try {
      if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Publishing will save and publish your current changes. Continue?')) {
        return;
      }
      
      await publishCareerPage();
      const publicUrl = `${window.location.origin}/${user.company.slug}/careers`;
      showSuccess(`Career page published successfully! Public URL: ${publicUrl}`, 5000);
    } catch (error) {
      console.error('Error publishing career page:', error);
      showError('Error publishing career page. Please try again.', 5000);
    }
  };

  const handleSave = async () => {
    try {
      await saveCareerPage();
      showSuccess('Career page saved successfully!', 3000);
    } catch (error) {
      console.error('Error saving career page:', error);
      showError('Error saving career page. Please try again.', 3000);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
        navigate(`/${companySlug}/dashboard`);
      }
    } else {
      navigate(`/${companySlug}/dashboard`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className={`bg-white  border-gray-200 px-6 py-3 transition-all duration-300 ${
        selectedComponent ? 'opacity-40' : 'opacity-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900">Careers Page Editor</h1>
              {hasUnsavedChanges && !isSaving && (
                <span className="text-xs text-amber-600">Unsaved changes</span>
              )}
              {isSaving && (
                <span className="text-xs text-blue-600">Saving...</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isPublished && (
              <button 
                onClick={() => {
                  const publicUrl = `${BACKEND_URL}/${user.company.slug}/careers`;
                  navigator.clipboard.writeText(publicUrl);
                  showInfo('Public URL copied to clipboard!', 3000);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Copy Link</span>
              </button>
            )}
            {isPublished && (
              <button 
                onClick={() => {
                  const publicUrl = `${BACKEND_URL}/${user.company.slug}/careers`;
                  window.open(publicUrl, '_blank');
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Open</span>
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                hasUnsavedChanges && !isSaving
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className={`px-4 py-2 text-sm text-white rounded-md font-medium flex items-center space-x-2 ${
                isPublishing 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPublishing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>{isPublished ? 'Update Published Page' : 'Publish Changes'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col relative transition-all duration-300 ${
          selectedComponent ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="flex border-gray-200">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'branding'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Branding
            </button>
          </div>
          <Sidebar activeTab={activeTab} />
        </div>

        <div className="flex-1" style={{ padding: 0 }}>
          <Canvas />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

const PageBuilder = () => {
  return (
    <PageBuilderProvider>
      <PageBuilderContent />
    </PageBuilderProvider>
  );
};

export default PageBuilder;
