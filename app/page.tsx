// View switcher (integration owner). One URL, three views (D-001).

import Link from "next/link";

const views = [
  {
    href: "/student",
    title: "Student",
    who: "Maya, 6th grade",
    blurb: "Work today's ratio mission with hints, not answers.",
  },
  {
    href: "/teacher",
    title: "Teacher",
    who: "Ms. Rivera",
    blurb: "See who is stuck, why, and what to do tomorrow.",
  },
  {
    href: "/parent",
    title: "Parent",
    who: "Maya's mom (phone)",
    blurb: "A text in Spanish with a 10-minute activity at home.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">Rova</h1>
      <p className="mt-2 text-lg text-slate-600">Think it through. Go the distance.</p>
      <p className="mt-1 text-sm text-slate-400">Prototype · replies are rule-based (AI planned)</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {views.map((view) => (
          <Link
            key={view.href}
            href={view.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">{view.title}</h2>
            <p className="text-sm text-indigo-700">{view.who}</p>
            <p className="mt-3 text-sm text-slate-600">{view.blurb}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
