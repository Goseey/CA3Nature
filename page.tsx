import Link from "next/link";
import Navbar from "./Navbar";

const features = [
  {
    emoji: "📅",
    title: "Events",
    description: "Browse and discover upcoming campus events, workshops, and social gatherings.",
    href: "/events",
    bg: "bg-blue-50",
    border: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-100 text-blue-600",
  },
  {
    emoji: "🗓️",
    title: "Timetable",
    description: "View your weekly class schedule and never miss a lecture again.",
    href: "/timetable",
    bg: "bg-violet-50",
    border: "border-violet-200 hover:border-violet-400",
    badge: "bg-violet-100 text-violet-600",
  },
  {
    emoji: "🗺️",
    title: "Campus Map",
    description: "Find buildings, labs, canteens, and facilities across campus quickly.",
    href: "/map",
    bg: "bg-emerald-50",
    border: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-600",
  },
  {
    emoji: "🔍",
    title: "Lost & Found",
    description: "Lost something or found an item? Post and browse to reunite belongings.",
    href: "/lost-found",
    bg: "bg-rose-50",
    border: "border-rose-200 hover:border-rose-400",
    badge: "bg-rose-100 text-rose-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero */}
        <section className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest">
            Your Student Life Hub
          </span>
          <h1 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
            Welcome to{" "}
            <span className="text-blue-500">Campus</span>Companion
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Events, your schedule, campus navigation, and lost items — all in one simple place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/timetable"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-sm transition-colors"
            >
              View Timetable
            </Link>
            <Link
              href="/events"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Quick Access
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className={`group flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${f.bg} ${f.border}`}
              >
                <span className={`w-11 h-11 flex items-center justify-center rounded-xl text-2xl mb-5 ${f.badge}`}>
                  {f.emoji}
                </span>
                <h3 className="text-slate-800 font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{f.description}</p>
                <span className="mt-5 text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
