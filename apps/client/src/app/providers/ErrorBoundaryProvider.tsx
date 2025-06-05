import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/shared/ui/ErrorFallback/ErrorFallback";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const ErrorBoundaryProvider = ({ children }: Props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export default ErrorBoundaryProvider;
