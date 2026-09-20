import Link from "next/link";
import type { ReactNode } from "react";

export function CatalogCard({
  title,
  description,
  icon,
  href,
  badge,
  selected = false,
}: {
  title: string;
  description?: string;
  icon: ReactNode;
  href?: string;
  badge?: string;
  selected?: boolean;
}) {
  const content = (
    <>
      <span className="catalog-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="catalog-card-title">{title}</span>
      {description && (
        <span className="catalog-card-description">{description}</span>
      )}
      {badge && <span className="catalog-badge">{badge}</span>}
      {href && (
        <span className="catalog-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );
  return href ? (
    <Link
      href={href}
      className={`catalog-card${selected ? " selected" : ""}`}
      aria-current={selected ? "page" : undefined}
    >
      {content}
    </Link>
  ) : (
    <div className="catalog-card planned">{content}</div>
  );
}
