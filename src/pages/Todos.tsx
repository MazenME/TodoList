import { ChangeEvent, useState } from "react";
import Paginator from "../components/Paginator";
import TodoSkeleton from "../components/TodoSkeleton";
import useAuthQuery from "../hooks/useAuthQuery";

import { ITodo } from "../interfaces";
import Button from "../components/ui/Button";
import { faker } from "@faker-js/faker";
import axiosInstance from "../config/config.axios";

const Todos = () => {
  const token = localStorage.getItem("token");
  const userData = token ? JSON.parse(token) : null;
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("asc");

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };

  const onSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const prevFun = () => {
    setPage((prev) => prev - 1);
  };
  const nextFun = () => {
    setPage((prev) => prev + 1);
  };

  const { data, isLoading, isFetching } = useAuthQuery({
    queryKey: [`PaginatedTodos-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  if (isLoading)
    return (
      <>
        <div className="w-1/2 mx-auto">
          <TodoSkeleton />
        </div>
      </>
    );

  const onFakeTodo = () => {
    for (let i = 0; i <= 48; i++) {
      const title = faker.lorem.words(3);
      axiosInstance.post(
        "/todos",
        {
          data: {
            title,
            complete: faker.datatype.boolean(0.9),
            user: [userData.user.id],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
    }
  };

  return (
    <>
      <div className="flex w-1/2 items-center justify-between mx-auto  my-10 ">
        <Button onClick={onFakeTodo} variant="outline" size={"sm"}>
          Generate todos
        </Button>

        <div className="flex items-center justify-around gap-x-2">
          <select
            value={sortBy}
            onChange={onSortByChange}
            className="p-2 border border-indigo-600 rounded-md cursor-pointer"
            name="sort"
            id="sort"
          >
            <option disabled>sort by</option>
            <option className="cursor-pointer" value={"asc"}>
              oldest
            </option>
            <option className="cursor-pointer" value={"desc"}>
              latest
            </option>
          </select>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            className="p-2 border border-indigo-600 rounded-md cursor-pointer"
            name="size"
            id="size"
          >
            <option disabled>page size</option>
            <option className="cursor-pointer" value={10}>
              10
            </option>
            <option className="cursor-pointer" value={20}>
              20
            </option>
            <option className="cursor-pointer" value={30}>
              30
            </option>
          </select>
        </div>
      </div>
      <div className="w-1/2 mx-auto">
        {data.data.length ? (
          data.data.map((todo: ITodo) => {
            return (
              <div
                key={todo.id}
                className="w-full flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
              >
                <p className="w-full font-semibold">{todo.title}</p>
                <div className="flex items-center justify-end w-full space-x-3">
                  {todo.complete ? (
                    <span className="text-green-500">completed</span>
                  ) : (
                    <span className="text-red-500">not completed</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
            <p className="text-center py-4">
              No todos found
            </p>
          
        )}
        
          <div className="text-center pb-4">
            <Paginator
              isLoading={isLoading || isFetching}
              page={page}
              pageCount={data.meta.pagination.pageCount}
              totalRecords={data.meta.pagination.total}
              prevFun={prevFun}
              nextFun={nextFun}
            />
          </div>
        
      </div>
    </>
  );
};

export default Todos;
