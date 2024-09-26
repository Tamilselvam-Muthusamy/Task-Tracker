import { useRecoilState, useRecoilValue } from "recoil";

import { Button } from "@mantine/core";
import moment from "moment";
import Table from "../../../components/table";
import { projectSelector, projectState } from "./project";
import { Link } from "react-router-dom";
import { Eye } from "tabler-icons-react";
import UpdateProject from "./update_project";

function ProjectTable() {
  const [state, setState] = useRecoilState(projectState);
  const projectData = useRecoilValue(projectSelector);
  return (
    <div className="space-y-8">
      <Table
        columns={[
          "S.No",
          "Title",
          "description",
          "createdBy",
          "createdAt",
          "Action",
        ]}
        from={projectData?.from ?? 0}
        to={projectData?.to ?? 0}
        total={projectData?.totalCount ?? 0}
        totalPages={projectData?.totalPages ?? 0}
        currentPage={state.page}
        onPageChanged={(page) => {
          setState({
            ...state,
            page,
          });
        }}
      >
        {projectData?.data?.map((item: any, i: number) => (
          <tr
            className="border-y border-transparent border-b-slate-100 "
            key={i}
          >
            <td className="table-body">{i + projectData.from}</td>
            <td className="table-body">{item.title ?? "None"}</td>
            <td className="table-body"> {item.description ?? "None"}</td>
            <td className="table-body">
              {item.user?.firstName} {item.user?.lastName ?? "None"}
            </td>
            <td className="table-body">
              {moment(item.createdAt.toString()).format("DD MMM YYYY, h:mm a")}
            </td>
            <td className="table-body">
              <div className="flex flex-row space-x-3">
                <Link to={"/project/" + item.id}>
                  <Button
                    variant="light"
                    leftIcon={<Eye size={16} />}
                    color="blue"
                    compact
                  >
                    View
                  </Button>
                </Link>
                <UpdateProject project={item} />
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
export default ProjectTable;
