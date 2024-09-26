import { ActionIcon, Button, Input } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import {
  atom,
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import { ArrowLeft, Search } from "tabler-icons-react";
import apiProvider from "../../../network/api_provider";
import Protected from "../../../components/protected";
import { Link, useParams } from "react-router-dom";
import TaskLoader from "./task_loader";
import TaskTable from "./task_table";
import TaskFilter from "./task_filter";

export const taskState = atom({
  key: "taskState",
  default: {
    search: "",
    page: 1,
    type: 0,
    status: 0,
    user: 0,
  },
});

export const taskSelector = selectorFamily({
  key: "taskSelector",
  get:
    (id: any) =>
    async ({ get }) => {
      const filter = get(taskState);
      const data = {
        page: filter.page,
        search: filter.search,
        status: filter.status,
        type: +filter.type,
        user: +filter.user,
      };
      const result: any = await apiProvider.get_task(data, id);
      return result?.data?.data;
    },
});

function TaskPage() {
  const [state, setState] = useRecoilState(taskState);
  const { id } = useParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const resetUserState = useResetRecoilState(taskState);
  const refershUserData = useRecoilRefresher_UNSTABLE(taskSelector(id));

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
          <div className="flex flex-row space-x-4">
            <Link to={"/project"}>
              <ActionIcon radius="xl" color="blue" variant="light">
                <ArrowLeft />
              </ActionIcon>
            </Link>
            <div className="text-xl font-bold text-black">Task</div>
          </div>
          <div className="flex flex-row justify-between items-end space-x-4">
            <TaskFilter />
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
        <React.Suspense fallback={<TaskLoader />}>
          <TaskTable />
        </React.Suspense>
      </div>
    </Protected>
  );
}
export default TaskPage;
