import type { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
}
const Alert = ({ children }: AlertProps) => {
  return (
    <>
      <button
        onClick={() => {
          alert("This is an alert message!");
        }}
      >
        {children}
      </button>
    </>
  );
};export default Alert;