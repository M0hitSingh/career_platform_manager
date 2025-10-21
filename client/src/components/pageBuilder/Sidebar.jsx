import ComponentLibrary from './ComponentLibrary';
import BrandingPanel from './BrandingPanel';

const Sidebar = ({ activeTab }) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      {activeTab === 'content' ? (
        <ComponentLibrary />
      ) : (
        <BrandingPanel />
      )}
    </div>
  );
};

export default Sidebar;
