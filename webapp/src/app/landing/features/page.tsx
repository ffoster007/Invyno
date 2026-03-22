import Link from "next/link";

export default function LandingFeaturesPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Features</h1>
      <p className="mt-2 text-neutral-600">Coming soon.</p>
      <Link href="/" className="mt-6 inline-block text-blue-600 underline">
        Home
      </Link>
    </main>
  );
}
