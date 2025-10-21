import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
import { usePageBuilder } from '../../context/PageBuilderContext';
import ComponentEditorModal from './ComponentEditorModal';
import ComponentRenderer from './ComponentRenderer';

// Component item in canvas
const CanvasComponent = ({ component, isSelected, onSelect, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: component.id,
    data: { componentId: component.id }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, padding: 0, margin: 0 }}
      {...attributes}
      className={`relative group transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Action Buttons - Show on Hover */}
      <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(component.id);
          }}
          className="p-2 bg-white text-blue-600 rounded-md shadow-md hover:bg-blue-50 border border-gray-200"
          title="Edit component"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(component.id);
          }}
          className="p-2 bg-white text-red-600 rounded-md shadow-md hover:bg-red-50 border border-gray-200"
          title="Remove component"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Drag Handle - Show on Hover */}
      <div className="absolute top-2 left-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...listeners}
          className="p-2 bg-white text-gray-600 rounded-md shadow-md hover:bg-gray-50 cursor-grab active:cursor-grabbing border border-gray-200"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>

      {/* Component Content */}
      <div className="overflow-hidden" style={{ padding: 0, margin: 0 }}>
        <ComponentRenderer component={component} />
      </div>
    </div>
  );
};

const Canvas = () => {
  const { components, branding, selectedComponent, setSelectedComponent, removeComponent, reorderComponents } = usePageBuilder();

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = components.findIndex(c => c.id === active.id);
    const newIndex = components.findIndex(c => c.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(components, oldIndex, newIndex);
      reorderComponents(reordered.map((c, i) => ({ ...c, order: i })));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col">
        {/* Canvas Header - Sticky */}
        <div className="sticky top-0 z-10 bg-white border-gray-200 px-6 py-3 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Visual Canvas</h2>
          <p className="text-xs text-gray-600">Click to add components, drag to reorder, hover to edit</p>
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 min-h-full overflow-auto"
          style={{
            backgroundColor: branding.backgroundColor,
            padding: 0,
            margin: 0,
            overflowX: 'hidden',
            maxWidth: '100%'
          }}
        >
          {/* Empty State */}
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No components yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click components from the sidebar to add them
                </p>
              </div>
            </div>
          ) : (
            /* Component List with Sortable */
            <SortableContext
              items={components.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-0" style={{ padding: '0 0', margin: '0 0 40px 0' }}>
                {components
                  .sort((a, b) => a.order - b.order)
                  .map((component) => (
                    <CanvasComponent
                      key={component.id}
                      component={component}
                      isSelected={selectedComponent === component.id}
                      onSelect={setSelectedComponent}
                      onRemove={removeComponent}
                    />
                  ))}
              </div>
            </SortableContext>
          )}
        </div>

        {/* Component Editor Modal */}
        <ComponentEditorModal
          isOpen={!!selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      </div>
    </DndContext>
  );
};

export default Canvas;
