/* eslint-disable prefer-const */
import { useRecoilState, useRecoilValue } from "recoil";
import { Badge, Tooltip } from "@mantine/core";
import moment from "moment";
import Table from "../../../components/table";
import { taskSelector, taskState } from "./task";
import { SquareCheck, SquareDot } from "tabler-icons-react";
import { useParams } from "react-router-dom";
import TaskEdit from "./update_task";

function TaskTable() {
  const { id } = useParams();
  const [state, setState] = useRecoilState(taskState);
  const userData = useRecoilValue(taskSelector(id));

  function statusColor(item: any) {
    // let statusId = item.toLowerCase().replaceAll("", "");
    let statusId = item;
    if (statusId === 1) {
      return "violet";
    } else if (statusId === 2) {
      return "blue";
    } else if (statusId === 3) {
      return "red";
    }
    return "green";
  }

  function statusCode(item: any) {
    // let statusId = item.toLowerCase().replaceAll("", "");
    let statusId = item;
    if (statusId === 1) {
      return "To Do";
    } else if (statusId === 2) {
      return "Inprogress";
    } else if (statusId === 3) {
      return "Reopen";
    }
    return "Done";
  }
  return (
    <div className="space-y-8">
      <Table
        columns={[
          "S.No",
          "Task Type",
          "Title",
          "Assignee",
          "status",
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
              {item.typeId === 1 ? (
                <Tooltip label="Task">
                  <div>
                    <SquareCheck size={20} color="blue" />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip label="Bug">
                  <div>
                    <SquareDot size={20} color="red" />
                  </div>
                </Tooltip>
              )}
            </td>
            <td className="table-body-active">{item.title ?? "None"}</td>
            <td className="table-body">
              {item.TaskAssignees?.map((e: any) => e.TaskToUser.firstName).join(
                " , "
              )}
            </td>
            <td className="table-body">
              {" "}
              <Badge color={statusColor(item.statusId)}>
                {statusCode(item.statusId)}
              </Badge>
            </td>
            <td className="table-body">
              {moment(item.createdAt.toString()).format("DD MMM YYYY, h:mm a")}
            </td>
            <td className="table-body">
              <TaskEdit task={item} />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
export default TaskTable;
