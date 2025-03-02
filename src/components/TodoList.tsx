import Button from "./ui/Button";
import useAuthQuery from "../hooks/useAuthQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/config.axios";
import toast from "react-hot-toast";
import TodoSkeleton from "./TodoSkeleton";


const TodoList = () => {
  const token = localStorage.getItem("token");
  const userData = token ? JSON.parse(token) : null;

  const [isUpdating, setIsUpdating] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const [isopenEditModal, setopenEditModal] = useState(false);
  const [toggleEditCompleteTodo, setToggleEditCompleteTodo] = useState(false);
  const [todoEdit, setTodoEdit] = useState<ITodo | null>({
    id: 0,
    documentId: " ",
    title: "",
    complete: false,
  });

  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenGenerateModal, setIsOpenGenerateModal] = useState(false);

  const [generateTodo, setGenerateTodo] = useState({
    title: "",
    complete: false,
    user: [userData.user.id],
  });

  const [generateTodoState, setGenerateTodoState] = useState(false);

  // ** Handlers

  const openGenerateModal = () => {
    setIsOpenGenerateModal(true);
  };

  const closeGenerateModal = () => {
    setIsOpenGenerateModal(false);
    setGenerateTodoState(false);
    setGenerateTodo({
      title: "",
      complete: false,
      user: [userData.user.id],
    });
  };

  const generateTodoStateHandler = () => {
    setGenerateTodoState((prev) => {
      const newValue = !prev;
      setGenerateTodo((prev) =>
        prev ? { ...prev, complete: newValue } : prev
      );
      return newValue;
    });
  };

  const onChangeGenerateTodoHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setGenerateTodo((prev) => (prev ? { ...prev, title: value } : prev));

  };




  const onSubmitGenerateTodoHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, complete } = generateTodo;
    setIsUpdating(true);

    try {
      const {status} =await axiosInstance.post('/todos',
        {
          data: {  
            title,
            complete,
            user: [userData.user.id], 
          },
        }, 
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        });

      if (status == 201 ) {
        toast.success("todo created successfully", {
          duration: 300,
          position: "top-center",
          style: {
            background: "#00ba00", 
            color: "#ffffff",
            width: "fit-content",
          },
        });
        setGenerateTodo({
          title: "",
          complete: false,
          user: [userData.user.id],
        });
        setGenerateTodoState(false);
        closeGenerateModal();
      }

    }catch(err) {
      console.log(err);
    }finally {
      setRefresher((prev) => !prev);
      setIsUpdating(false);
    }


  }

  const toggleEditCompleteTodoHandler = () => {
    setToggleEditCompleteTodo((prev) => {
      const newValue = !prev;
      setTodoEdit((prev) => (prev ? { ...prev, complete: newValue } : prev));
      return newValue;
    });
  };

  const closeEditModal = () => {
    setopenEditModal(false);
    setTodoEdit(null);
  };
  const openEditModal = (todo: ITodo) => {
    setopenEditModal(true);
    setTodoEdit(todo);
  };

  const { data, isLoading } = useAuthQuery({
    queryKey: ["TodoList", refresher],
    url: "/users/me?populate[todos][sort]=createdAt:desc",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  if (isLoading) return <TodoSkeleton />;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTodoEdit((prev) => (prev ? { ...prev, title: value } : prev));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, complete, documentId } = todoEdit as ITodo;
    try {
      const { status } = await axiosInstance.put(
        `/todos/${documentId}`,
        {
          data: {
            title,
            complete,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        setIsUpdating(true);
        toast.success("todo updated successfully", {
          duration: 300,
          position: "top-center",
          style: {
            background: "#ffbb00",
            color: "#0000a5",
            width: "fit-content",
          },
        });
        setTodoEdit(null);
        setToggleEditCompleteTodo(false);
        closeEditModal();
        setRefresher((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openConfirmModal = (todo: ITodo) => {
    setIsOpenConfirmModal(true);
    setTodoEdit(todo);
  };

  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
    setTodoEdit(null);
  };

  const removeProductHandler = async () => {
    const { documentId } = todoEdit as ITodo;

    try {
      const { status } = await axiosInstance.delete(`/todos/${documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 204) {
        toast.success("todo deleted successfully", {
          duration: 300,
          position: "top-center",
          style: {
            background: "#ffbb00",
            color: "#0000a5",
            width: "fit-content",
          },
        });
        closeConfirmModal();
        setRefresher((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="space-y-1 ">
        <div className="flex w-fit mx-auto my-10 gap-x-2">
          <Button onClick={openGenerateModal} variant="default" size={"sm"}>
            Post new todo
          </Button>
         
        </div>

        <div className="">
              {data.todos.length ? (
                data.todos.map((todo: ITodo) => {
                  return (
                    <div
                    key={todo.id}
                    className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
                  >
                    <div>
                    <p className="w-full font-semibold">{todo.title}</p>
                    </div>

                    <div className="flex items-center justify-end w-full space-x-3">
                    {todo.complete ? (
                    
                      <p className="text-green-500 ">completed</p>
                   
                  ) : (
                    <p className="text-red-500 ">not completed</p>
                  )}
                    </div>
                    
                    <div className="flex items-center justify-end w-full space-x-3">
                      <Button size={"sm"} onClick={() => openEditModal(todo)}>
                        Edit
                      </Button>
                      <Button variant={"danger"} size={"sm"} onClick={() => openConfirmModal(todo)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  );
                })
              ) : (
               
                  <p  className="text-center py-4">
                    No todos found
                  </p>
               
              )}
        </div>
      </div>

      {/* generate modal */}

      <Modal
        isOpen={isOpenGenerateModal}
        closeModal={closeGenerateModal}
        title="generate todo"
      >
        <form className="space-y-3" onSubmit={onSubmitGenerateTodoHandler}>
          <Input required value={generateTodo?.title} onChange={onChangeGenerateTodoHandler} />
          <p className="mt-3 ms-3 flex items-center justify-start gap-x-7">
            complete:{" "}
            <span className="flex items-center justify-center  rounded-3xl bg-slate-200 p-1">
              <button
                onClick={generateTodoStateHandler}
                type="button"
                className={`rounded-3xl py-1 px-4 transition-all duration-300 ${
                  generateTodoState
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-300"
                } `}
              >
                True
              </button>
              <button
                onClick={generateTodoStateHandler}
                type="button"
                className={`rounded-3xl py-1 px-4 transition-all duration-300 ${
                  !generateTodoState ? "bg-red-500 text-white" : "bg-slate-300"
                }`}
              >
                False
              </button>
            </span>
          </p>
          <div className="flex justify-end gap-x-4">
            <Button>Generate</Button>
            <Button
              onClick={closeGenerateModal}
              variant={"cancel"}
              className="relative right-0 left-0 bg-orange-300"
              type="button"
            >
              cancle
            </Button>
          </div>
        </form>
      </Modal>

      {/* ** edit modal */}

      <Modal
        isOpen={isopenEditModal}
        closeModal={closeEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={onSubmitHandler}>
          <Input required value={todoEdit?.title} onChange={onChangeHandler} />
          <p className="mt-3 ms-3 flex items-center justify-start gap-x-7">
            complete:{" "}
            <span className="flex items-center justify-center  rounded-3xl bg-slate-200 p-1">
              <button
                onClick={toggleEditCompleteTodoHandler}
                type="button"
                className={`rounded-3xl py-1 px-4 transition-all duration-300 ${
                  toggleEditCompleteTodo
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-300"
                }`}
              >
                True
              </button>
              <button
                onClick={toggleEditCompleteTodoHandler}
                type="button"
                className={`rounded-3xl py-1 px-4 transition-all duration-300 ${
                  !toggleEditCompleteTodo
                    ? "bg-red-500 text-white"
                    : "bg-slate-300"
                }`}
              >
                False
              </button>
            </span>
          </p>
          <div className="flex justify-end gap-x-4">
            <Button isLoading={isUpdating}>update</Button>
            <Button
              onClick={closeEditModal}
              variant={"cancel"}
              className="relative right-0 left-0 bg-orange-300"
              type="button"
            >
              cancle
            </Button>
          </div>
        </form>
      </Modal>

      {/* ** delete todo */}

      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this todo ?"
        description="Deleting this todo will remove it permanently from your profile. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} onClick={removeProductHandler}>
            Yes, remove
          </Button>
          <Button type="button" variant={"cancel"} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TodoList;
