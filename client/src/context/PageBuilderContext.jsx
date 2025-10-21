import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/api';

const PageBuilderContext = createContext(null);

export const usePageBuilder = () => {
  const context = useContext(PageBuilderContext);
  if (!context) {
    throw new Error('usePageBuilder must be used within PageBuilderProvider');
  }
  return context;
};

export const PageBuilderProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [branding, setBranding] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    buttonColor: '#EF4444',
    textColor: '#1F2937',
    backgroundColor: '#F3F4F6'
  });
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [companySlug, setCompanySlug] = useState(null);

  // Add a new component to the canvas
  const addComponent = useCallback((type, config = {}) => {
    const newComponent = {
      id: uuidv4(),
      type,
      order: components.length,
      config
    };
    setComponents(prev => [...prev, newComponent]);
    setHasUnsavedChanges(true);
    return newComponent.id;
  }, [components.length]);

  // Remove a component by id
  const removeComponent = useCallback((componentId) => {
    setComponents(prev => {
      const filtered = prev.filter(c => c.id !== componentId);
      // Reorder remaining components
      return filtered.map((c, index) => ({ ...c, order: index }));
    });
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
    setHasUnsavedChanges(true);
  }, [selectedComponent]);

  // Update component configuration
  const updateComponent = useCallback((componentId, config) => {
    console.log('Context updateComponent called:', { componentId, config });
    setComponents(prev => {
      const updated = prev.map(c => {
        if (c.id === componentId) {
          const newComponent = { ...c, config: { ...c.config, ...config } };
          console.log('Updated component:', newComponent);
          return newComponent;
        }
        return c;
      });
      console.log('All components after update:', updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Reorder components (for drag and drop)
  const reorderComponents = useCallback((newOrder) => {
    setComponents(newOrder.map((c, index) => ({ ...c, order: index })));
    setHasUnsavedChanges(true);
  }, []);

  // Update branding colors
  const updateBranding = useCallback((updates) => {
    setBranding(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);



  // Save career page
  const saveCareerPage = useCallback(async () => {
    if (!companySlug) {
      throw new Error('Company slug not available');
    }

    setIsSaving(true);
    try {
      const careerPageData = {
        components: components.map(c => ({
          id: c.id,
          type: c.type,
          order: c.order,
          config: c.config
        })),
        branding
      };

      const response = await api.put(`/career-pages`, careerPageData);
      setHasUnsavedChanges(false);
      return response.data;
    } catch (error) {
      console.error('Error saving career page:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [components, branding, companySlug]);

  // Publish career page
  const publishCareerPage = useCallback(async () => {
    if (!companySlug) {
      throw new Error('Company slug not available');
    }

    setIsPublishing(true);
    try {
      // First save the current state
      await saveCareerPage();
      
      // Then publish
      const response = await api.post(`/career-pages/publish`);
      setIsPublished(true);
      setHasUnsavedChanges(false);
      return response.data;
    } catch (error) {
      console.error('Error publishing career page:', error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, [saveCareerPage, companySlug]);

  // Load career page data from API
  const loadCareerPageFromAPI = useCallback(async () => {
    try {
      const response = await api.get('/career-pages');
      const careerPageData = response.data.careerPage;
      
      if (careerPageData.components) {
        setComponents(careerPageData.components);
      }
      if (careerPageData.branding) {
        setBranding(prev => ({ ...prev, ...careerPageData.branding }));
      }
      if (careerPageData.isPublished !== undefined) {
        setIsPublished(careerPageData.isPublished);
      }
      setHasUnsavedChanges(false);
      
      return careerPageData;
    } catch (error) {
      console.error('Failed to load career page:', error);
      throw error;
    }
  }, []);

  // Load career page data (from passed data)
  const loadCareerPage = useCallback((careerPageData) => {
    if (careerPageData.components) {
      setComponents(careerPageData.components);
    }
    if (careerPageData.branding) {
      setBranding(prev => ({ ...prev, ...careerPageData.branding }));
    }
    if (careerPageData.isPublished !== undefined) {
      setIsPublished(careerPageData.isPublished);
    }
    setHasUnsavedChanges(false);
  }, []);

  // Mark changes as unsaved when components or branding change
  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setComponents([]);
    setSelectedComponent(null);
    setBranding({
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      buttonColor: '#EF4444',
      textColor: '#1F2937',
      backgroundColor: '#F3F4F6'
    });
    setIsPublished(false);
    setHasUnsavedChanges(false);
  }, []);

  const value = {
    components,
    selectedComponent,
    branding,
    isPublished,
    isSaving,
    isPublishing,
    hasUnsavedChanges,
    companySlug,
    addComponent,
    removeComponent,
    updateComponent,
    reorderComponents,
    setSelectedComponent,
    updateBranding,
    loadCareerPage,
    loadCareerPageFromAPI,
    saveCareerPage,
    publishCareerPage,
    setCompanySlug,
    markUnsaved,
    reset
  };

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  );
};
