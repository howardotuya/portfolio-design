import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/project/project-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projectBySlug, projects } from "@/content/projects";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  const url = `/work/${project.slug}`;
  const image = {
    url: `/og/${project.slug}.jpg`,
    width: 1200,
    height: 630,
    alt: `${project.title} cover`,
  };
  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.subtitle,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  return (
    <>
      <SiteHeader active={project.kind === "deck" ? "decks" : "documents"} onHome={false} />
      <ProjectPage project={project} />
      <SiteFooter />
    </>
  );
}
