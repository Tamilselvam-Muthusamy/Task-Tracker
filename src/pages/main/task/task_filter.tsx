import { Button, Drawer, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { Filter } from "tabler-icons-react";
import apiProvider from "../../../network/api_provider";

export const TaskFilterState = atom({
  key: "taskState",
  default: {
    search: "",
    page: 1,
    type: 0,
    status: 0,
    user: 0,
    isFilterApplied: false,
  },
});

function TaskFilter() {
  const [state, setState] = useRecoilState(TaskFilterState);
  const [filter, setFilter] = useState<any>({ ...state });
  const [opened, setOpened] = useState(false);
  const [userData, setUserData] = useState<any>([]);

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setUserData(result?.data?.data?.data ?? []);
    }
    return null;
  }

  const changeType = (type: any) => {
    setFilter({ ...filter, type: type });
  };

  const changeStatus = (status: any) => {
    setFilter({ ...filter, status: status });
  };

  const changeUser = (user: any) => {
    setFilter({ ...filter, user: user });
  };

  const applyFilter = () => {
    setState({ ...filter, isFilterApplied: true });
    setOpened(false);
  };

  const clearFilter = () => {
    const defaultState = {
      search: "",
      page: 1,
      type: 0,
      status: 0,
      user: 0,
      isFilterApplied: false,
    };
    setState(defaultState);
    setFilter(defaultState);
    setOpened(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title={<div className="text-xl font-bold">Task Filter</div>}
        padding="xl"
        size="26%"
        overlayProps={{ opacity: 0.5 }}
        position="right"
      >
        <div style={{ position: "relative" }}>
          <div className="flex flex-col space-y-4">
            <Select
              value={filter.type}
              onChange={changeType}
              dropdownPosition="bottom"
              label="Task"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={[
                { value: "1", label: "Task" },
                { value: "2", label: "Bug" },
              ]}
            />
            <Select
              value={filter.status}
              onChange={changeStatus}
              dropdownPosition="bottom"
              label="Status"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={[
                { value: "1", label: "To Do" },
                { value: "2", label: "InProgress" },
                { value: "3", label: "Reopen" },
                { value: "4", label: "Done" },
              ]}
            />
            <Select
              value={filter.user}
              onChange={changeUser}
              dropdownPosition="bottom"
              label="Assignee"
              variant="filled"
              searchable
              placeholder="Select filter"
              data={userData?.map((item: any) => ({
                value: (item.id ?? 0).toString(),
                label: `${item.firstName} ${item.lastName}` ?? "",
              }))}
            />
            <div className="flex flex-row pt-4 space-x-4 w-full">
              <Button
                className="w-1/2 text-gray-500"
                color="gray.3"
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
              <Button className="w-1/2" color="primary.5" onClick={applyFilter}>
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      <Button
        onClick={() => {
          setOpened(true);
        }}
        leftIcon={<Filter size={18} />}
        variant="light"
        color={state.isFilterApplied ? "orange" : "blue"}
      >
        {state.isFilterApplied ? "Clear Filters" : "Filters"}
      </Button>
    </div>
  );
}

export default TaskFilter;

// import { Button, Drawer, Select } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { atom, useRecoilState } from "recoil";
// import { Filter } from "tabler-icons-react";
// import apiProvider from "../../../network/api_provider";

// export const TaskFilterState = atom({
//   key: "taskState",
//   default: {
//     search: "",
//     page: 1,
//     type: 0,
//     status: 0,
//     user: 0,
//     isFilterApplied: false,
//   },
// });

// function TaskFilter() {
//   const [state, setState] = useRecoilState(TaskFilterState);
//   const [filter, setFilter] = useState<any>({ ...state });
//   const [opened, setOpened] = useState(false);
//   const [userData, setUserData] = useState<any>([]);

//   async function fetchUsers() {
//     const params = {
//       page: 0,
//       searchRef: "",
//     };
//     const result = await apiProvider.fetchUserData(params);
//     if (result != null) {
//       setUserData(result?.data?.data?.data ?? []);
//     }
//     return null;
//   }

//   const changeType = (type: any) => {
//     setState({ ...state, type });
//   };

//   const changeStatus = (status: any) => {
//     setState({ ...state, status });
//   };

//   const changeUser = (user: any) => {
//     setState({ ...state, user });
//   };

//   const applyFilter = () => {
//     setState({ ...state, isFilterApplied: true });
//     setOpened(false);
//   };

//   const clearFilter = () => {
//     const defaultState = {
//       search: "",
//       page: 1,
//       type: 0,
//       status: 0,
//       user: 0,
//       isFilterApplied: false,
//     };
//     setState(defaultState);
//     // setFilter(defaultState);
//     setOpened(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <Drawer
//         opened={opened}
//         onClose={() => {
//           setOpened(false);
//         }}
//         title={<div className="text-xl font-bold">Task Filter</div>}
//         padding="xl"
//         size="26%"
//         overlayProps={{ opacity: 0.5 }}
//         position="right"
//       >
//         <div style={{ position: "relative" }}>
//           <div className="flex flex-col space-y-4">
//             <Select
//               value={state.type}
//               onChange={changeType}
//               dropdownPosition="bottom"
//               label="Task"
//               variant="filled"
//               searchable
//               placeholder="Select filter"
//               data={[
//                 { value: "1", label: "Task" },
//                 { value: "2", label: "Bug" },
//               ]}
//             />
//             <Select
//               value={state.status}
//               onChange={changeStatus}
//               dropdownPosition="bottom"
//               label="Status"
//               variant="filled"
//               searchable
//               placeholder="Select filter"
//               data={[
//                 { value: "1", label: "To Do" },
//                 { value: "2", label: "InProgress" },
//                 { value: "3", label: "Reopen" },
//                 { value: "4", label: "Done" },
//               ]}
//             />
//             <Select
//               value={state.user}
//               onChange={changeUser}
//               dropdownPosition="bottom"
//               label="Assignee"
//               variant="filled"
//               searchable
//               placeholder="Select filter"
//               data={userData?.map((item: any) => ({
//                 value: (item.id ?? 0).toString(),
//                 label: `${item.firstName} ${item.lastName}` ?? "",
//               }))}
//             />
//             <div className="flex flex-row pt-4 space-x-4 w-full">
//               <Button
//                 className="w-1/2 text-gray-500"
//                 color="gray.3"
//                 onClick={clearFilter}
//               >
//                 Clear Filter
//               </Button>
//               <Button className="w-1/2" color="primary.5" onClick={applyFilter}>
//                 Apply Filter
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Drawer>
//       <Button
//         onClick={() => {
//           setOpened(true);
//         }}
//         leftIcon={<Filter size={18} />}
//         variant="light"
//         color={state.isFilterApplied ? "orange" : "blue"}
//       >
//         {state.isFilterApplied ? "Clear Filters" : "Filters"}
//       </Button>
//     </div>
//   );
// }

// export default TaskFilter;
//
