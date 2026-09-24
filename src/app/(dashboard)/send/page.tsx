import { Suspense } from "react";
import SendContent from "./SendContent";

/**
 * Route: /send
 * Entry point for the WhatsApp campaign send screen. SendContent reads the
 * selected image template from the search params, so it is wrapped in a
 * Suspense boundary while that data is resolved.
 */
export default function Page() {
  return (
    // Show a fallback while the campaign content loads
    <Suspense fallback={<div className="p-10">Loading campaign...</div>}>
      <SendContent />
    </Suspense>
  );
}
