import type { ReactNode } from "react";
import { Link } from "@remix-run/react";
import { MdChevronLeft } from "react-icons/md";

export function BackButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="-ml-2 flex w-fit items-center py-2 text-xl font-semibold text-primary-7"
      to={href}
    >
      <div className="mr-1">
        <MdChevronLeft aria-hidden="true" />
      </div>
      <div className="text-base">{children}</div>
    </Link>
  );
}
