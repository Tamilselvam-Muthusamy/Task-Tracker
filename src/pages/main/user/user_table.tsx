import { useRecoilState, useRecoilValue } from "recoil";

import { Badge } from "@mantine/core";
import moment from "moment";
import Table from "../../../components/table";
import { userSelector, userState } from "./user";
import EditUser from "./edit_user";

function UserTable() {
  const [state, setState] = useRecoilState(userState);
  const userData = useRecoilValue(userSelector);
  return (
    <div className="space-y-8">
      <Table
        columns={[
          "S.No",
          "Full Name",
          "Email",
          "Role",
          "Created Date & Time",
          "Action",
        ]}
        from={userData?.from ?? 0}
        to={userData?.to ?? 0}
        total={userData?.total ?? 0}
        totalPages={userData?.totalPages ?? 0}
        currentPage={state.page}
        onPageChanged={(page) => {
          setState({
            ...state,
            page,
          });
        }}
      >
        {userData?.data?.map((item: any, i: number) => (
          <tr
            className="border-y border-transparent border-b-slate-100 "
            key={i}
          >
            <td className="table-body">{i + userData.from}</td>
            <td className="table-body">
              {item.firstName} {item.lastName}
            </td>
            <td className="table-body-active">{item.email ?? "None"}</td>
            <td className="table-body">
              <Badge color={item?.Role?.role === "Admin" ? "blue" : "red"}>
                {item?.Role?.role ?? "None"}
              </Badge>
            </td>
            {/* <td className="table-body">{item.mobile ?? "None"}</td> */}
            <td className="table-body">
              {moment(item.createdAt.toString()).format("DD MMM YYYY, h:mm a")}
            </td>
            <td className="table-body">
              <EditUser users={item} />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
export default UserTable;
