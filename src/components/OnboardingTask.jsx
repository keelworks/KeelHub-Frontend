import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiOutlineTemplate } from 'react-icons/hi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import { Dialog, Transition } from '@headlessui/react';


const OnboardingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks/onboarding');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    const updatedTasks = items.map((task, index) => ({
      id: task.id,
      new_order_number: index + 1
    }));

    try {
      await axios.put('http://localhost:3001/api/tasks/onboarding/order', { tasks: updatedTasks });
    } catch (error) {
      console.error('Error updating task order:', error);
      fetchTasks(); 
    }
  };

  
  const handleNewTaskSubmit = async (newTask) => {
    try {
      await axios.post('http://localhost:3001/api/tasks/onboarding/create', {
        task_name: newTask.task_name,
        description: newTask.template, 
      });
      fetchTasks(); 
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };

  const handleTemplateClick = (task) => {
    setSelectedTask(task);
    setIsTemplateModalOpen(true);
  };

  const handleEditTaskSubmit = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/${selectedTask.id}`, {
        task_name: updatedTask.task_name,
        description: updatedTask.template,
      });
      fetchTasks();
      setIsTaskModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:3001/api/tasks/${taskToDelete.id}`);
        fetchTasks();
        setIsEditOptionsModalOpen(false);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsTaskModalOpen(true);
  };
  
  const handleCopyTemplate = () => {
    if (selectedTask && selectedTask.description) {
      navigator.clipboard.writeText(selectedTask.description)
        .then(() => alert('Template copied to clipboard!'))
        .catch(err => console.error('Failed to copy template: ', err));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflow</h1>
          <p className="text-gray-600 mt-1">Onboarding tasks management</p>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out"
          onClick={() => {
            setSelectedTask({});
            setIsEditMode(false);
            setIsTaskModalOpen(true);
          }}
        >
          <FiPlus className="mr-2" />
          <span>New Task</span>
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden" {...provided.droppableProps} ref={provided.innerRef}>
              <thead className="bg-gray-50">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Task Name</th>
                  <th className="py-3 px-6 text-left">Template</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <tr 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`border-b border-gray-200 hover:bg-gray-100 ${snapshot.isDragging ? 'bg-blue-50' : ''}`}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {index + 1}. {task.task_name}
                        </td>
                        <td className="py-3 px-6 text-left">
                          <button 
                            className="text-gray-500 hover:text-gray-700" 
                            onClick={() => handleTemplateClick(task)}
                            title="View Template"
                          >
                            <HiOutlineTemplate size={20} />
                          </button>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button 
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => handleEditClick(task)}
                            title="Edit Task"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              handleDeleteTask(task);
                            }}
                            title="Delete Task"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
  
      <TaskModal
        isOpen={isTaskModalOpen}
        closeModal={() => {
          setIsTaskModalOpen(false);
          setIsEditMode(false);
          setSelectedTask(null);
        }}
        onSubmit={isEditMode ? handleEditTaskSubmit : handleNewTaskSubmit}
        initialTask={selectedTask}
        isTemplateView={false}
      />

      <TaskModal
        isOpen={isTemplateModalOpen}
        closeModal={() => setIsTemplateModalOpen(false)}
        initialTask={selectedTask}
        isTemplateView={true}
        onCopyTemplate={handleCopyTemplate}
      />
    </div>
  );
};

export default OnboardingTasks;