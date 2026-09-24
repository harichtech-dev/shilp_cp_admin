import { redirect } from "next/navigation";

/**
 * Home - app entry point.
 * Immediately redirects visitors to the login page.
 */
export default function Home() {
  // Send the user straight to the login page.
  return (
     redirect("/login")
  );
}
