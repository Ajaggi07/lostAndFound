import Link from "next/link";
import {
  Search,
  PackagePlus,
  ShieldCheck,
  Users,
  ArrowRight,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find Lost Items",
    description:
      "Browse reported found items and discover whether your missing belongings have been submitted.",
  },
  {
    icon: PackagePlus,
    title: "Report an Item",
    description:
      "Report something you have lost or an item you have found on campus.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Claims",
    description:
      "Submit a claim with identifying information so the reported item can be verified.",
  },
];

const steps = [
  {
    number: "01",
    title: "Browse or Report",
    description:
      "Search existing listings or submit details about a lost or found item.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "If you find a matching item, submit a claim with relevant information.",
  },
  {
    number: "03",
    title: "Recover",
    description:
      "The person who reported the item can review the claim and coordinate its return.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              YOUR CAMPUS LOST & FOUND PORTAL
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Lost something?
              <br />
              <span className="text-blue-400">Find it here.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              A smarter way to reconnect students with their lost belongings.
              Discover found items, report missing possessions and help make
              your campus a more responsible community.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Browse Items
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3.5 font-semibold text-white transition hover:border-blue-400 hover:bg-white/5"
              >
                <PackagePlus size={18} />
                Report an Item
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-400" />
                Student-focused
              </span>

              <span className="flex items-center gap-2">
                <Clock size={17} className="text-blue-400" />
                Easy to use
              </span>

              <span className="flex items-center gap-2">
                <Users size={17} className="text-blue-400" />
                Community-driven
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    CampusFind
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Lost & Found Overview
                  </p>
                </div>

                <div className="rounded-xl bg-blue-500/15 p-3 text-blue-300">
                  <Search size={23} />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-500/15 p-3 text-red-300">
                      <Search size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Lost an item?
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Search reported found belongings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-300">
                      <PackagePlus size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Found something?
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Help someone recover their belongings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-blue-300" size={22} />

                    <p className="text-sm leading-6 text-blue-100">
                      Every report brings someone closer to finding what
                      they lost.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/10 bg-slate-800 p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-400" size={20} />
                <div>
                  <p className="text-xs font-semibold text-white">
                    Campus Community
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Connecting people and belongings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            What We Offer
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            Everything you need in one place
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            A centralized platform designed to make the lost and found
            process simpler for everyone on campus.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-blue-50 p-4 text-blue-600">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              How CampusFind Works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-xl font-extrabold text-blue-600">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl bg-blue-600 px-7 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-extrabold text-white">
            Be part of a helpful campus community.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Start browsing reported items or create an account to submit
            your own lost and found reports.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}