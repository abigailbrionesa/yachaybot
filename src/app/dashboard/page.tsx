"use client";

import { signOut, useSession } from "next-auth/react";

function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4">Holaa</h1>
      {session?.user && (
        <>
          <p className="mb-2">Logged in as: {session.user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
