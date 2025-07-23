type Props = { title: string; description: string };

export const ErrorBoundaryAlert = (props: Props) => {
  const { title, description } = props;

  return (
    <div className="w-1/2 rounded-full top-20 mx-auto p-3">
      <div className="p-4 text-red-900 bg-red-100 border border-red-200 rounded-md">
        <div className="flex justify-between flex-wrap">
          <div className="w-0 flex-1 flex">
            <div className="mr-3 pt-1"></div>
            <div>
              <h4 className="text-md leading-6 font-medium">{title}</h4>
              <p className="text-sm">{description}</p>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
