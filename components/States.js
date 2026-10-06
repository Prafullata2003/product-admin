export const Loader = () => (
  <div className="flex justify-center p-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" role="status" aria-label="Loading" /></div>
);
export const Empty = ({ text = "No products found." }) => <p className="p-10 text-center text-gray-500">{text}</p>;
export const ErrorBox = ({ message, onRetry }) => (
  <div className="p-10 text-center">
    <p className="mb-3 text-red-600">{message}</p>
    <button className="btn" onClick={onRetry}>Retry</button>
  </div>
);
