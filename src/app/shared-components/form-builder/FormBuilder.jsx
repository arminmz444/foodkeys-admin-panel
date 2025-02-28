import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// All the input types from your <select> (excluding "validate" and date is commented out)
const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "password", label: "Password" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "email", label: "Email" },
  { value: "range", label: "Range" },
  { value: "search", label: "Search" },
  { value: "tel", label: "Tel" },
  { value: "url", label: "Url" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Datetime" },
  { value: "datetime-local", label: "Datetime-local" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  // { value: 'date', label: 'Date' }, // <--- Commented out per your request
];

const createEmptyField = () => ({
  id: Date.now(),
  name: "",
  label: "",
  type: "text",
  showValidation: false,
  required: false,
  min: "",
  max: "",
  maxLength: "",
  pattern: "",
  options: [],
});

// Helper for reordering fields when dragging
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Final Generated Form
const GeneratedForm = ({ fields }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getValidationRules = (field) => {
    if (!field.showValidation) return {};
    const rules = {};
    if (field.required) {
      rules.required = "ضروری است (Required)";
    }
    if (field.min) {
      rules.min = {
        value: Number(field.min),
        message: `حداقل مقدار (Min) برابر با ${field.min}`,
      };
    }
    if (field.max) {
      rules.max = {
        value: Number(field.max),
        message: `حداکثر مقدار (Max) برابر با ${field.max}`,
      };
    }
    if (field.maxLength) {
      rules.maxLength = {
        value: Number(field.maxLength),
        message: `حداکثر طول (MaxLength) برابر با ${field.maxLength}`,
      };
    }
    if (field.pattern) {
      rules.pattern = {
        value: new RegExp(field.pattern),
        message: "فرمت نامعتبر (Invalid format)",
      };
    }
    return rules;
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
    console.log("Form Data:", data);
  };

  const renderField = (field) => {
    const rules = getValidationRules(field);

    switch (field.type) {
      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-semibold">
              {field.label || field.name}
            </label>
            <select
              {...register(field.name, rules)}
              className="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1"
              defaultValue=""
              style={{ direction: "rtl" }}
            >
              <option value="" disabled>
                لطفاً یک گزینه انتخاب کنید (Select an option)
              </option>
              {field.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-pink-400 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <p className="block mb-1 font-semibold">
              {field.label || field.name}
            </p>
            {field.options.map((opt, i) => (
              <label key={i} className="ml-4">
                <input
                  type="radio"
                  className="ml-1"
                  value={opt}
                  {...register(field.name, rules)}
                  style={{ cursor: "pointer" }}
                />
                {opt}
              </label>
            ))}
            {errors[field.name] && (
              <p className="text-pink-400 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="ml-2"
                {...register(field.name, rules)}
                style={{ cursor: "pointer" }}
              />
              {field.label || field.name}
            </label>
            {errors[field.name] && (
              <p className="text-pink-400 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-semibold">
              {field.label || field.name}
            </label>
            <textarea
              {...register(field.name, rules)}
              className="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1 h-24"
              style={{ direction: "rtl" }}
            />
            {errors[field.name] && (
              <p className="text-pink-400 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
      // case 'date':
      //   return (
      //     <div key={field.id} className="mb-4">
      //       <label className="block mb-1 font-semibold">
      //         {field.label || field.name}
      //       </label>
      //       <input
      //         type="date"
      //         {...register(field.name, rules)}
      //         className="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1"
      //         style={{ direction: 'rtl' }}
      //       />
      //       {errors[field.name] && (
      //         <p className="text-pink-400 text-sm mt-1">
      //           {errors[field.name].message}
      //         </p>
      //       )}
      //     </div>
      //   );
      default:
        return (
          <div key={field.id} className="mb-4">
            <label className="block mb-1 font-semibold">
              {field.label || field.name}
            </label>
            <input
              type={field.type}
              {...register(field.name, rules)}
              className="w-full bg-[#142337] text-white border border-gray-600 rounded px-2 py-1"
              style={{ direction: "rtl" }}
            />
            {errors[field.name] && (
              <p className="text-pink-400 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">فرم ساخته‌شده (Generated Form)</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => renderField(field))}
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded mt-2"
        >
          ارسال (Submit)
        </button>
      </form>
    </div>
  );
};

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentField, setCurrentField] = useState(createEmptyField());
  const [showGeneratedForm, setShowGeneratedForm] = useState(false);

  // Right-panel: new field creation
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "showValidation" || name === "required") {
      setCurrentField({ ...currentField, [name]: checked });
    } else {
      setCurrentField({ ...currentField, [name]: value });
    }
  };

  const handleCreateField = () => {
    if (!currentField.name.trim()) {
      alert("لطفاً نام فیلد را وارد کنید (Please provide a field name).");
      return;
    }
    setFields((prev) => [...prev, { ...currentField, id: Date.now() }]);
    setCurrentField(createEmptyField());
  };

  const handleGenerateForm = () => {
    setShowGeneratedForm(true);
  };

  // Left-panel: existing fields
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(
      fields,
      result.source.index,
      result.destination.index
    );
    setFields(reordered);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleFieldUpdate = (index, updated) => {
    const newFields = [...fields];
    newFields[index] = updated;
    setFields(newFields);
  };

  const handleDelete = (index) => {
    if (
      !window.confirm(
        "آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟ (Are you sure?)"
      )
    )
      return;
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleReset = () => {
    setFields([]);
    setEditingIndex(null);
    setCurrentField(createEmptyField());
    setShowGeneratedForm(false);
  };

  const handleDeleteAll = () => {
    if (!window.confirm("حذف همه فیلدها؟ (Delete all fields?)")) return;
    setFields([]);
    setEditingIndex(null);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0c1a2a] text-white flex flex-col items-center py-10 px-4 text-right"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT PANEL: LAYOUT (چیدمان) */}
        <div>
          <h2 className="text-2xl font-bold mb-2">چیدمان (Layout)</h2>
          <p className="text-sm mb-4">
            می‌توانید از سازنده ورودی برای اضافه کردن فیلدها استفاده کنید (You
            can start adding fields with Input Creator)
          </p>
          <div className="bg-[#142337] p-4 rounded shadow">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable-fields">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {fields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-2 border border-gray-600 rounded"
                          >
                            {/* Header row: label + buttons + DRAG HANDLE */}
                            <div
                              className="flex justify-between items-center px-3 py-2 bg-[#1f2b3b] cursor-all-scroll"
                              {...provided.dragHandleProps}
                            >
                              <span className="font-semibold">
                                {field.label || field.name}
                              </span>
                              <div className="flex space-x-2 space-x-reverse">
                                {editingIndex === index ? (
                                  <>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                                    >
                                      لغو ویرایش (CANCEL EDIT)
                                    </button>
                                    <button
                                      onClick={() => handleDelete(index)}
                                      className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
                                    >
                                      حذف (DELETE)
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEdit(index)}
                                      className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
                                    >
                                      ویرایش (EDIT)
                                    </button>
                                    <button
                                      onClick={() => handleDelete(index)}
                                      className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
                                    >
                                      حذف (DELETE)
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            {/* Inline edit form if this index is being edited */}
                            {editingIndex === index && (
                              <div className="p-4 bg-[#142337]">
                                <div className="mb-2">
                                  <label className="block text-sm mb-1">
                                    نام فیلد (Name)
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                    value={field.name}
                                    onChange={(e) =>
                                      handleFieldUpdate(index, {
                                        ...field,
                                        name: e.target.value,
                                      })
                                    }
                                    style={{ direction: "rtl" }}
                                  />
                                </div>
                                <div className="mb-2">
                                  <label className="block text-sm mb-1">
                                    برچسب (Label)
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                    value={field.label}
                                    onChange={(e) =>
                                      handleFieldUpdate(index, {
                                        ...field,
                                        label: e.target.value,
                                      })
                                    }
                                    style={{ direction: "rtl" }}
                                  />
                                </div>
                                <div className="mb-2">
                                  <label className="block text-sm mb-1">
                                    نوع (Type)
                                  </label>
                                  <select
                                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                    value={field.type}
                                    onChange={(e) =>
                                      handleFieldUpdate(index, {
                                        ...field,
                                        type: e.target.value,
                                      })
                                    }
                                    style={{ direction: "rtl" }}
                                  >
                                    {FIELD_TYPES.map((ft) => (
                                      <option
                                        key={ft.value}
                                        value={ft.value}
                                        disabled={ft.value === "validate"}
                                      >
                                        {ft.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {(field.type === "select" ||
                                  field.type === "radio") && (
                                  <div className="mb-2">
                                    <label className="block text-sm mb-1">
                                      گزینه‌ها (Options) (جداشده با ویرگول)
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                      value={field.options.join(",")}
                                      onChange={(e) =>
                                        handleFieldUpdate(index, {
                                          ...field,
                                          options: e.target.value
                                            .split(",")
                                            .map((opt) => opt.trim()),
                                        })
                                      }
                                      style={{ direction: "rtl" }}
                                    />
                                  </div>
                                )}
                                <div className="mb-2">
                                  <label className="inline-flex items-center text-sm">
                                    <input
                                      type="checkbox"
                                      className="ml-2"
                                      checked={field.showValidation}
                                      onChange={(e) =>
                                        handleFieldUpdate(index, {
                                          ...field,
                                          showValidation: e.target.checked,
                                        })
                                      }
                                    />
                                    نمایش اعتبارسنجی (Show validation)
                                  </label>
                                </div>
                                {field.showValidation && (
                                  <>
                                    <div className="mb-2">
                                      <label className="inline-flex items-center text-sm">
                                        <input
                                          type="checkbox"
                                          className="ml-2"
                                          checked={field.required}
                                          onChange={(e) =>
                                            handleFieldUpdate(index, {
                                              ...field,
                                              required: e.target.checked,
                                            })
                                          }
                                        />
                                        ضروری (Required)
                                      </label>
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm mb-1">
                                        حداقل (Min)
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                        value={field.min}
                                        onChange={(e) =>
                                          handleFieldUpdate(index, {
                                            ...field,
                                            min: e.target.value,
                                          })
                                        }
                                        style={{ direction: "rtl" }}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm mb-1">
                                        حداکثر (Max)
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                        value={field.max}
                                        onChange={(e) =>
                                          handleFieldUpdate(index, {
                                            ...field,
                                            max: e.target.value,
                                          })
                                        }
                                        style={{ direction: "rtl" }}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm mb-1">
                                        حداکثر طول (MaxLength)
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                        value={field.maxLength}
                                        onChange={(e) =>
                                          handleFieldUpdate(index, {
                                            ...field,
                                            maxLength: e.target.value,
                                          })
                                        }
                                        style={{ direction: "rtl" }}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm mb-1">
                                        الگو (Pattern) (RegEx)
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                                        value={field.pattern}
                                        onChange={(e) =>
                                          handleFieldUpdate(index, {
                                            ...field,
                                            pattern: e.target.value,
                                          })
                                        }
                                        style={{ direction: "rtl" }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Bottom buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
              >
                بازنشانی (RESET)
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
              >
                حذف همه (DELETE ALL)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INPUT CREATOR (سازنده ورودی) */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            سازنده ورودی (Input Creator)
          </h2>
          <p className="text-sm mb-4">
            این فرم به شما اجازه می‌دهد ورودی‌ها را بسازید و ویرایش کنید. (This
            form allows you to create and update inputs)
          </p>
          <div className="bg-[#142337] p-4 rounded shadow">
            <div className="mb-2">
              <label className="block text-sm mb-1">نام (Name):</label>
              <input
                type="text"
                name="name"
                value={currentField.name}
                onChange={handleFieldChange}
                className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                style={{ direction: "rtl" }}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">نوع (Type):</label>
              <select
                name="type"
                value={currentField.type}
                onChange={handleFieldChange}
                className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                style={{ direction: "rtl" }}
              >
                {FIELD_TYPES.map((ft) => (
                  <option
                    key={ft.value}
                    value={ft.value}
                    disabled={ft.value === "validate"}
                  >
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">برچسب (Label):</label>
              <input
                type="text"
                name="label"
                value={currentField.label}
                onChange={handleFieldChange}
                className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                style={{ direction: "rtl" }}
              />
            </div>
            {/* Options for select/radio */}
            {(currentField.type === "select" ||
              currentField.type === "radio") && (
              <div className="mb-2">
                <label className="block text-sm mb-1">
                  گزینه‌ها (Options) (جداشده با ویرگول):
                </label>
                <input
                  type="text"
                  name="options"
                  value={currentField.options.join(",")}
                  onChange={(e) =>
                    setCurrentField({
                      ...currentField,
                      options: e.target.value.split(",").map((o) => o.trim()),
                    })
                  }
                  className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                  style={{ direction: "rtl" }}
                />
              </div>
            )}
            <div className="mb-2">
              <label className="inline-flex items-center text-sm">
                <input
                  type="checkbox"
                  name="showValidation"
                  checked={currentField.showValidation}
                  onChange={handleFieldChange}
                  className="ml-2"
                />
                نمایش اعتبارسنجی (Show validation)
              </label>
            </div>
            {currentField.showValidation && (
              <>
                <div className="mb-2">
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="required"
                      checked={currentField.required}
                      onChange={handleFieldChange}
                      className="ml-2"
                    />
                    ضروری (Required)
                  </label>
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">حداکثر (Max)</label>
                  <input
                    type="number"
                    name="max"
                    value={currentField.max}
                    onChange={handleFieldChange}
                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                    style={{ direction: "rtl" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">حداقل (Min)</label>
                  <input
                    type="number"
                    name="min"
                    value={currentField.min}
                    onChange={handleFieldChange}
                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                    style={{ direction: "rtl" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">
                    حداکثر طول (MaxLength)
                  </label>
                  <input
                    type="number"
                    name="maxLength"
                    value={currentField.maxLength}
                    onChange={handleFieldChange}
                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                    style={{ direction: "rtl" }}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">
                    الگو (Pattern) (RegEx)
                  </label>
                  <input
                    type="text"
                    name="pattern"
                    value={currentField.pattern}
                    onChange={handleFieldChange}
                    className="w-full bg-[#1f2b3b] text-white border border-gray-600 rounded px-2 py-1"
                    style={{ direction: "rtl" }}
                  />
                </div>
              </>
            )}
            <div className="flex items-center space-x-2 space-x-reverse mt-4">
              <button
                onClick={handleCreateField}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold"
              >
                ساخت فیلد (CREATE)
              </button>
              <span className="text-gray-400">یا (or)</span>
              <button
                onClick={handleGenerateForm}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded font-semibold"
              >
                ساخت فرم (GENERATE FORM)
              </button>
            </div>
          </div>
          {showGeneratedForm && <GeneratedForm fields={fields} />}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
