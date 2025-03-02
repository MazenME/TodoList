const TodoSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          role="status"
          className=" w-full p-4 space-y-4 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5  bg-gray-200 rounded-full w-32 mb-2.5"></div>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="h-2.5 bg-gray-200 rounded-full  w-12"></div>
              <div className="h-2.5 bg-gray-200 rounded-full  w-12"></div>
            </div>
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </>
  );
};

export default TodoSkeleton;
