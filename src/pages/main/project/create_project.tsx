import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

import { Folder } from "tabler-icons-react";
import apiProvider from "../../../network/api_provider";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { projectSelector } from "./project";
useRecoilRefresher_UNSTABLE;

function CreateProject() {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<any>();
  const refreshProject = useRecoilRefresher_UNSTABLE(projectSelector);

  const form: any = useForm({
    validateInputOnChange: true,
    initialValues: { title: "", description: "" },
    // functions will be used to validate values at corresponding key
    validate: {
      title: (value) => (value.length < 2 ? "Enter Project name" : null),
      description: (value) => (value.length < 2 ? "Enter description" : null),
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const data = {
      title: values.title,
      description: values.description,
      projectCreatorId: +id,
    };
    const result = await apiProvider.create_project(data);
    if (result != null) {
      setOpened(false);
      clearForm();
      refreshProject();
    }
    setLoading(false);
  };

  const clearForm = () => {
    form.reset();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setId(localStorage.getItem("userId"));
    }
  }, []);

  return (
    <div>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          clearForm();
          setOpened(false);
        }}
        title={<div className="text-xl p-4 font-bold">Create Project</div>}
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="p-4 ">
            <div className="space-y-4 flex flex-col">
              <div className="flex space-x-4">
                <div className="w-1/2 ">
                  <TextInput
                    label={
                      <div className="font-bold">
                        Project Name<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    {...form.getInputProps("title")}
                    variant="filled"
                    placeholder="Enter Project name"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <Textarea
                    label={
                      <div className="font-bold">
                        Description<span className="ml-1 text-red-500">*</span>
                      </div>
                    }
                    variant="filled"
                    placeholder="Enter description"
                    {...form.getInputProps("description")}
                  />
                </div>
              </div>

              <div className="flex flex-row items-end space-x-2 justify-end">
                <Button
                  color="gray"
                  onClick={() => {
                    setOpened(false), clearForm();
                  }}
                >
                  Cancel
                </Button>
                <Button loading={loading} type="submit">
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <Button
        leftIcon={<Folder size={16} />}
        variant="light"
        color="teal"
        compact
        onClick={() => setOpened(true)}
        className={""}
      >
        <div>Create Project</div>
      </Button>
    </div>
  );
}
export default CreateProject;
