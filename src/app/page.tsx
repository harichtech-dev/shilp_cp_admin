import { redirect } from "next/navigation";

export default function Home() {
  // Redirect directly to the login page.
  return (
     redirect("/login")
  );
}
