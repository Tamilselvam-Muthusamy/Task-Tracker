import { Button, Input } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import {
  atom,
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import { Search } from "tabler-icons-react";
import apiProvider from "../../../network/api_provider";
import Protected from "../../../components/protected";
import CreateProject from "./create_project";
import CreateTask from "./create_task";
import ProjectLoader from "./project_loader";
import ProjectTable from "./project_table";

export const projectSelector = selector({
  key: "projectSelector",
  get: async ({ get }) => {
    const filter = get(projectState);
    const data = {
      page: filter.page,
      search: filter.search,
    };
    const result = await apiProvider.project_data(data);
    return result?.data?.data ?? null;
  },
});

export const projectState = atom({
  key: "projectState",
  default: {
    search: "",
    page: 1,
  },
});

function ProjectPage() {
  const [state, setState] = useRecoilState(projectState);
  const searchRef = useRef<HTMLInputElement>(null);
  const resetUserState = useResetRecoilState(projectState);
  const refershUserData = useRecoilRefresher_UNSTABLE(projectSelector);

  const searchUsers = async () => {
    setState({ ...state, search: searchRef.current?.value ?? "", page: 1 });
  };

  useEffect(() => {
    if (searchRef.current != null) {
      searchRef.current.value = state.search;
    }
  }, [state]);

  useEffect(() => {
    resetUserState();
    refershUserData();
  }, []);

  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="text-xl font-bold text-black">Project</div>
          <div className="flex flex-row justify-between items-end space-x-4">
            {localStorage.getItem("role") === "Admin" ? (
              <CreateProject />
            ) : (
              <></>
            )}
            {localStorage.getItem("role") === "Admin" ? <CreateTask /> : <></>}
            <Input
              ref={searchRef}
              variant="filled"
              placeholder="Search"
              icon={<Search size={16} />}
            />
            <Button onClick={searchUsers} size="sm">
              Search
            </Button>
          </div>
        </div>
        <React.Suspense fallback={<ProjectLoader />}>
          <ProjectTable />
        </React.Suspense>
      </div>
    </Protected>
  );
}
export default ProjectPage;
