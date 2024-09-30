import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiCopy } from 'react-icons/fi';


const ExtendDueDateModal = ({ isOpen, closeModal, onSubmit, initialTask = {}, isTemplateView = false, onCopyTemplate }) => {
    const [task, setTask] = useState({
      task_name: '',
      template: '',
      extendDueDate: 0,
    });

    useEffect(() => {
        if (initialTask) {
          setTask({
            task_name: initialTask.task_name || '',
            template: initialTask.description || '',
            extendDueDate: initialTask.extendDueDate || 0, 
          });
        }
      }, [initialTask]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handleIncrement = () => {
        setTask(prevTask => ({ ...prevTask, extendDueDate: Math.min(prevTask.extendDueDate + 1, 10) }));
    };

    const handleDecrement = () => {
        setTask(prevTask => ({ ...prevTask, extendDueDate: Math.max(prevTask.extendDueDate - 1, 0) }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(task);
      closeModal();
    };
  

    return (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
    
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {isTemplateView ? 'Task Details' : 'Edit Task'}
                    </Dialog.Title>
                    {isTemplateView ? (
                      <div className="mt-4">
                        <h4 className="text-md font-medium">Task Name</h4>
                        <p className="text-sm text-gray-500 mb-4">{task.task_name}</p>
                        {task.template && <>
                            <h4 className="text-md font-medium">Template</h4>
                            <p className="text-sm text-gray-500 mb-2">{task.template}</p>
                        
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={onCopyTemplate}
                        >
                          <FiCopy className="mr-2" />
                          Copy Template
                        </button>
                        </>}
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                          <label htmlFor="extendDueDate" className="block text-sm font-medium text-gray-700">Estimated Time Completion*</label>
                          <p className="text-sm text-gray-500 mb-2">Select how many days the task will be due in.</p>
                          <div className="flex items-center space-x-2">
                              <button
                                  type="button"
                                  className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                                  onClick={handleDecrement}
                              >
                                  -
                              </button>
                              <span>{task.extendDueDate} days</span>
                              <button
                                  type="button"
                                  className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                                  onClick={handleIncrement}
                              >
                                  +
                              </button>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          >
                            {initialTask && initialTask.id ? 'Update' : 'Save'}
                          </button>
                        </div>
                      </form>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      );
    };
    
    export default ExtendDueDateModal;