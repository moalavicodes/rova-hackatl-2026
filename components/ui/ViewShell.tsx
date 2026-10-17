// Shared frame for every view: a header with a way back home, so no screen is a dead end.

import Link from "next/link";

export function ViewShell({
  title,
  owner,
  narrow = false,
  children,
}: {
  title: string;
  owner: string;
  narrow?: boolean; // parent view is phone-sized
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm font-medium text-indigo-700 hover:underline">
          ← Rova home
        </Link>
        <span className="text-xs text-slate-400">{owner}</span>
      </header>
      <main className={`mx-auto w-full flex-1 px-4 py-6 ${narrow ? "max-w-sm" : "max-w-5xl"}`}>
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function ComingSoon({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
      <p className="mb-3 font-medium">Not built yet. Planned for this view:</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
