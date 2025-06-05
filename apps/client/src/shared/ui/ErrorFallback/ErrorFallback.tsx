import { FallbackProps, useErrorBoundary } from "react-error-boundary";

export const ErrorFallback = ({ error }: FallbackProps) => {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetBoundary}>Try again</button>
    </div>
  );
};
