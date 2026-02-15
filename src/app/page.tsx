import Image from "next/image";

const LOGO_URL =
  "https://raw.githubusercontent.com/CalgaryHacks2026/Image_Hosting/refs/heads/main/Collagio_With_Logo.png?token=GHSAT0AAAAAADSN554TBWBCI6GP2CG5DYZG2MRDAIA";

const SPECIFC_LOGO_URL =
  "https://raw.githubusercontent.com/CalgaryHacks2026/Image_Hosting/refs/heads/main/93f59d4e-c49f-40b1-8e67-90f8c75ffb64.png?token=GHSAT0AAAAAADSN554THCXE54TRMPSQUQNY2MRDIBQ";


export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
  <div className="flex items-center gap-3">
    <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-zinc-200">
      <Image
        src={SPECIFC_LOGO_URL}
        alt="Collagio logo"
        fill
        className="object-contain"
        priority
      />
    </div>
    <span className="text-lg font-semibold tracking-tight">Collagio</span>
  </div>

  {/* removed nav */}
</header>

      {/* Hero */}
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-6 md:pt-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            {/* Accent pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="ml-2">A smarter way to collect + search</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Your life, organized as a{" "}
              <span className="bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                living collage
              </span>
              .
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">
              Collagio lets you upload moments (images, audio, notes), tag them,
              and instantly find what you need later—like a personal archive that
              actually feels fun to use.
            </p>

            {/* Signup (no onSubmit, server-safe) */}
            <div id="signup" className="mt-8">
              <form
                action="#"
                className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
              >
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm shadow-sm outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Sign up
                </button>
              </form>

              <p className="mt-3 text-xs text-zinc-500">
                No spam. Just a heads-up when we launch.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-600">
                <span className="rounded-full border border-zinc-200 px-3 py-1">
                  📌 Tags + dates
                </span>
                <span className="rounded-full border border-zinc-200 px-3 py-1">
                  🔎 Fast search
                </span>
                <span className="rounded-full border border-zinc-200 px-3 py-1">
                  🎧 Audio + images
                </span>
              </div>
            </div>
          </div>

          {/* Logo / mock visual */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-blue-500/10 via-pink-500/10 to-emerald-500/10 blur-2xl" />

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-zinc-700">Collagio</div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center rounded-2xl bg-zinc-50 p-6">
                <div className="relative h-40 w-full max-w-md">
                  <Image
                    src={LOGO_URL}
                    alt="Collagio wordmark with logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <MiniCard title="Upload" desc="Add photos, audio, notes." />
                <MiniCard title="Tag" desc="Organize by themes + dates." />
                <MiniCard title="Search" desc="Find anything instantly." />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <section id="features" className="mt-16">
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Made for collections"
              desc="Catalog anything—memories, research, receipts, projects—without making it feel like homework."
            />
            <FeatureCard
              title="Search that works"
              desc="Tags + keywords + dates help you pull things back up fast."
            />
            <FeatureCard
              title="Simple, clean UI"
              desc="A calm design with a pop of color inspired by the Collagio icon."
            />
          </div>
        </section>

        <section
          id="how"
          className="mt-16 rounded-3xl border border-zinc-200 bg-zinc-50 p-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            <Step n="1" title="Create a space" desc="Your archive starts empty and stays yours." />
            <Step n="2" title="Add entries" desc="Upload media + notes with tags + date." />
            <Step n="3" title="Ask & find" desc="Search and filter anytime—no digging." />
          </ol>
        </section>

        <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-xs text-zinc-500 md:flex-row">
          <span>© {new Date().getFullYear()} Collagio</span>
          <div className="flex gap-4">
            <a className="hover:text-zinc-800" href="#">
              Privacy
            </a>
            <a className="hover:text-zinc-800" href="#">
              Terms
            </a>
            <a className="hover:text-zinc-800" href="#signup">
              Sign up
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <li className="list-none rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 text-xs font-semibold text-white">
          {n}
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-zinc-600">{desc}</div>
    </li>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-zinc-600">{desc}</div>
    </div>
  );
}
