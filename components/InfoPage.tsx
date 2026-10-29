import type { ReactNode } from "react";

type InfoPageProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function InfoPage({ title, intro, children }: InfoPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-text">{title}</h1>
      {intro ? <p className="mt-3 text-muted">{intro}</p> : null}
      <div className="mt-8 space-y-5 text-sm leading-6 text-muted [&_a]:text-accent [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-text">
        {children}
      </div>
    </main>
  );
}
