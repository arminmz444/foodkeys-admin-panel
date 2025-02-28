// HistoryTab.tsx (example)
import { Controller, useFormContext } from "react-hook-form";
import WYSIWYGEditor from "app/shared-components/WYSIWYGEditor.jsx";

function HistoryTab() {
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name="history" // must match the name in your DTO or your defaultValues
        control={control}
        defaultValue=""
        render={({ field: { value, onChange } }) => (
          <WYSIWYGEditor
            value={value || ""}
            onChange={onChange}
            // any style or config needed
          />
        )}
      />
    </div>
  );
}

export default HistoryTab;
