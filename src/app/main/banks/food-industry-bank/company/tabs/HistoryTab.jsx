// HistoryTab.tsx (example)
import { Controller, useFormContext } from "react-hook-form";
import CustomJoditEditor from "app/shared-components/jodit-editor/CustomJoditEditor";

function HistoryTab() {
  const { control } = useFormContext();

  return (
    <div>
      {/* <Controller
        name="history"
        control={control}
        defaultValue=""
        render={({ field: { value, onChange } }) => (
          <WYSIWYGEditor
            direction="ltr"
            dir="ltr"
            style={{ textAlign: "left", direction: "ltr" }}
            className="mt-8 mb-16"
            value={value}
            onChange={onChange}
          />
        )}
      /> */}
      <Controller
        name="history"
        control={control}
        defaultValue=""
        render={({ field: { value, onChange } }) => (
          <CustomJoditEditor
            value={value}
            onChange={onChange}
            direction="ltr"
            dir="ltr"
            style={{ textAlign: "left", direction: "ltr" }}
          />
        )}
      />
    </div>
  );
}

export default HistoryTab;
