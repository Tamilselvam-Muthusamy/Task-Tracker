import { TableSkeleton } from "../../../components/table";

export default function UserLoader() {
  return (
    <div className="space-y-8 pt-4">
      <TableSkeleton
        columns={[
          "S.No",
          "Full Name",
          "Email",
          "Role",
          "Created Date & Time",
          "Action",
        ]}
      />
    </div>
  );
}
