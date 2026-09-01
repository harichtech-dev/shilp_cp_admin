import { redirect } from "next/navigation";

export default function Home() {
  // Direct login page par redirect kar do
  return (
     redirect("/login")
  );
}
