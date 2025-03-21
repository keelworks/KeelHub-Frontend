import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiCopy } from "react-icons/fi";

const TaskModal = ({
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
  });

  useEffect(() => {
    if (initialTask) {
      setTask({
        task_name: initialTask.taskName || "",
        template: initialTask.description || "",
      });
      if (initialTask.taskName == "All onboarding tasks completed") {
        setTask({
          task_name: initialTask.taskName,
          template: initialTask.taskName,
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
                  {editView
                    ? "View Template"
                    : isTemplateView
                    ? "Task Details"
                    : initialTask && initialTask.id
                    ? "Edit Task"
                    : "New Task"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="task_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {editView || isTemplateView ? "Task" : "Task*"}
                    </label>
                    <input
                      type="text"
                      id="task_name"
                      name="task_name"
                      value={task.task_name}
                      onChange={handleChange}
                      placeholder="Enter task name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      readOnly={editView || isTemplateView}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {editView || isTemplateView
                        ? "Task Template (View only)"
                        : "Task Template (Optional)"}
                    </label>
                    <textarea
                      id="template"
                      name="template"
                      value={task.template}
                      onChange={handleChange}
                      placeholder="e.g. Good [Weekday], [Applicant First Name]. Thank you for reaching out..."
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      rows="4"
                      readOnly={editView || isTemplateView}
                    ></textarea>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    {isTemplateView || editView ? (
                      <>
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={onCopyTemplate}
                        >
                          <FiCopy className="mr-2" />
                          Copy Template
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </>
                    ) : (
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
                          {initialTask && initialTask.id ? "Update" : "Save"}
                        </button>
                      </>
                    )}
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

export default TaskModal;
