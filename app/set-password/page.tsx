import React, { Suspense } from "react";
import SetPasswordPage from "./SetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordPage />
    </Suspense>
  );
}
