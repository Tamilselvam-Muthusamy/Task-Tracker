import { TableSkeleton } from "../../../components/table";

export default function ProjectLoader() {
  return (
    <div className="space-y-8 pt-4">
      <TableSkeleton
        columns={[
          "S.No",
          "Title",
          "description",
          "Role",
          "createdBy",
          "createdAt",
          "Action",
        ]}
      />
    </div>
  );
}
