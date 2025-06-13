import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiCopy } from "react-icons/fi";

const EditDueDateModal = ({
  isOpen,
  closeModal,
  onSubmit,
  initialTask = {},
  isTemplateView = false,
  editView = false,
  onCopyTemplate,
}) => {

  const [task, setTask] = useState({
  task_name: "",
  template: "",
  due_date: 1, // NEW
});

useEffect(() => {
  if (initialTask) {
    setTask({
      task_name: initialTask.task_name || "",
      template: initialTask.description || "",
      due_date: initialTask.due_date || 1, // NEW
    });

    if (initialTask.taskName === "All onboarding tasks completed") {
      setTask({
        task_name: initialTask.taskName,
        template: initialTask.taskName,
        due_date: 1, // Reset due_date
      });
    }
  }
}, [initialTask]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
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
                  
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-3">Postpone due date</div>
                  
                  {!isTemplateView && !editView && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Relative Due Date (in days)*
                      </label>
                      <div className="mt-1 flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() =>
                            setTask((prev) => ({
                              ...prev,
                              due_date: Math.max(1, prev.due_date - 1),
                            }))
                          }
                          className="px-2 py-1 text-lg bg-gray-200 rounded hover:bg-gray-300"
                          disabled={task.due_date <= 1}
                        >
                          -
                        </button>
                        <span className="text-lg font-medium">{task.due_date}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setTask((prev) => ({
                              ...prev,
                              due_date: Math.min(10, prev.due_date + 1),
                            }))
                          }
                          className="px-2 py-1 text-lg bg-gray-200 rounded hover:bg-gray-300"
                          disabled={task.due_date >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end space-x-3">
                      <>
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
                          {"Update"}
                        </button>
                      </>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditDueDateModal;
