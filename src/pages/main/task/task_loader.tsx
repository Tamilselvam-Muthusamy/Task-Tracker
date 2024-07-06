import { TableSkeleton } from "../../../components/table";

export default function TaskLoader() {
  return (
    <div className="space-y-8 pt-4">
      <TableSkeleton
        columns={[
          "S.No",
          "Task Type",
          "Title",
          "Assignee",
          "Created Date & Time",
          "status",
          "Action",
        ]}
      />
    </div>
  );
}
