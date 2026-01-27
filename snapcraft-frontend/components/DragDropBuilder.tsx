import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useRef } from "react";

interface DragDropBuilderProps {
  workflow: string[];
  setWorkflow: React.Dispatch<React.SetStateAction<string[]>>;
  marketData: { [key: string]: number };
}

const DragDropBuilder = ({ workflow, setWorkflow, marketData }: DragDropBuilderProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const onDragEnd = (result: any) => { // This line (17) is the likely culprit
    const { source, destination } = result;
    if (!destination) return;
    const items = Array.from(workflow);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setWorkflow(items);
    validateWorkflow(items);
  };

  const actions = ["Buy Token", "Sell Token", "Set Price Trigger", "Stake", "Unstake"];

  const handleCustomize = (action: string) => {
    setSelectedAction(action);
    setCustomValue(action.includes("(") ? action.split("(")[1].replace(")", "") : "");
  };

  const saveCustomization = () => {
    if (selectedAction && customValue) {
      const isValid = validateInput(selectedAction, customValue);
      if (isValid) {
        const updatedWorkflow = workflow.map((item) =>
          item === selectedAction ? `${selectedAction} (${customValue})` : item
        );
        setWorkflow(updatedWorkflow);
        setSelectedAction(null);
        setCustomValue("");
        setValidationMessage(null);
      }
    }
  };

  const validateInput = (action: string, value: string): boolean => {
    if (action === "Set Price Trigger" && isNaN(Number(value))) {
      setValidationMessage("Price must be a number.");
      return false;
    }
    return true;
  };

  const validateWorkflow = (workflow: string[]) => {
    if (workflow.length > 0 && !workflow.some((item) => item.startsWith("Set Price Trigger"))) {
      setValidationMessage("Workflow requires a price trigger for safety.");
    } else {
      setValidationMessage(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, action: string) => {
    if (e.touches.length === 2) {
      if (canvasRef.current) canvasRef.current.style.transform = "scale(1.2)";
    } else if (e.touches.length === 1) {
      handleCustomize(action);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && canvasRef.current) {
      const touch = e.touches[0];
      if (touch.clientX < 50) {
        setWorkflow(workflow.filter((_, i) => i !== 0));
      }
    }
  };

  const handleTouchEnd = () => {
    if (canvasRef.current) canvasRef.current.style.transform = "scale(1)";
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/5 bg-white p-4 rounded-lg shadow-md" onTouchMove={handleTouchMove}>
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Actions</h3>
          <div className="space-y-2">
            {actions.map((action) => (
              <div
                key={action}
                className="p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200"
                onTouchStart={(e) => handleTouchStart(e, action)}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleCustomize(action)}
              >
                {action} {marketData[action] && `($${marketData[action]})`}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-4/5 relative" ref={canvasRef} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Workflow Canvas</h3>
            {validationMessage && <span className="text-red-500 text-sm">{validationMessage}</span>}
          </div>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[400px] border-dashed border-2 border-gray-300 p-4 rounded-lg"
              >
                {workflow.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 mb-2 bg-blue-100 rounded shadow hover:bg-blue-200"
                        onTouchStart={(e) => handleTouchStart(e, item)}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => handleCustomize(item)}
                      >
                        {item}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Customize {selectedAction}</h3>
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Enter value (e.g., 1000 for price)"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomization}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default DragDropBuilder;