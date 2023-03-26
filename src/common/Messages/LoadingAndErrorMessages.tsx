import React, { FunctionComponent } from "react";
import clsx from "clsx";
import "./loadingAndErrorMessagesProps.css";

interface LoadingAndErrorMessagesProps {
  isLoading: boolean;
  loadingErrorMessage?: string;
  isAnyData: boolean;
  noDataMessage?: string;
}

const LoadingAndErrorMessages: FunctionComponent<
  LoadingAndErrorMessagesProps
> = ({ isLoading, loadingErrorMessage, isAnyData, noDataMessage }) => {
  if (isLoading) {
    return (
      <div
        className={clsx("loadingErrorMessagesAlignment", "spinner-border m-5")}
        role="status"
      />
    );
  }
  if (loadingErrorMessage) {
    return (
      <div className="alert alert-danger alert-dismissible fade show">
        <strong>Error</strong> {loadingErrorMessage}
      </div>
    );
  }
  if (!isAnyData) {
    if (noDataMessage) {
      return (
        <div className="loadingErrorMessagesAlignment">{noDataMessage}</div>
      );
    }
    return (
      <div className="loadingErrorMessagesAlignment">No results found.</div>
    );
  }
  return null;
};

export default LoadingAndErrorMessages;
