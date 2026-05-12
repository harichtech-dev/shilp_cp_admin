import { Suspense } from "react";
import SendContent from "./SendContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading campaign...</div>}>
      <SendContent />
    </Suspense>
  );
}
