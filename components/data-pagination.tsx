"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PageInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  itemCount: number;
}

interface DataPaginationProps {
  pageInfo: PageInfo;
  name: string;
}

export function DataPagination({ pageInfo, name }: DataPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { total, page, pageSize, totalPages } = pageInfo;

  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);

    if (newPage === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", newPage.toString());
    }

    return `?${newParams.toString()}`;
  };

  const navigateToPage = (newPage: number) => {
    router.push(`/disciples${createPageUrl(newPage)}`);
  };

  const renderPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center md:justify-between w-full pb-6">
      <p className="text-sm text-muted-foreground shrink-0">
        Showing {(page - 1) * pageSize + 1} to{" "}
        {Math.min(page * pageSize, total)} of {total} {name}
      </p>

      <Pagination className="md:justify-end justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              onClick={page > 1 ? () => navigateToPage(page - 1) : undefined}
              className={
                page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>

          {renderPageNumbers().map((pageNum, index) => (
            <PaginationItem key={index.toString()}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  size="sm"
                  onClick={() => navigateToPage(pageNum)}
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              size="sm"
              onClick={
                page < totalPages ? () => navigateToPage(page + 1) : undefined
              }
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
