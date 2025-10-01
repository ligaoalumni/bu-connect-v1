"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  EmptyState,
  Input,
} from "@/components";
import { readUsers } from "@/repositories";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Pagination } from "./__components/pagination";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useTransition } from "react";
import { User } from "@prisma/client";
import { PaginationResult } from "@/types";

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 500;

export default function Page() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const searchQuery = searchParams.get("search") || "";

  const [data, setData] = useState<
    PaginationResult<Omit<User, "password" | "notifications" | "rate">>
  >({ count: 0, data: [], hasMore: false });
  const [filter, setFilter] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filter !== searchQuery) {
        const params = new URLSearchParams(searchParams.toString());

        if (filter) {
          params.set("search", filter);
        } else {
          params.delete("search");
        }

        // Reset to page 1 when search changes
        params.set("page", "1");

        startTransition(() => {
          router.push(`/batch/${slug}/alumni?${params.toString()}`, {
            scroll: false,
          });
        });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [filter, searchQuery, router, slug, searchParams]);

  // Fetch users with memoized function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await readUsers({
        batch: Number(slug),
        pagination: {
          limit: ITEMS_PER_PAGE,
          page: offset,
        },
        order: "asc",
        orderBy: "firstName",
        // search: searchQuery || undefined,
        filter: searchQuery || undefined,
      });

      setData(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setData({ count: 0, data: [], hasMore: false });
    } finally {
      setIsLoading(false);
    }
  }, [slug, offset, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="px-5 md:px-10">
      <div className="my-6 flex flex-col md:flex-row justify-start items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">List of Alumni</h1>
          <h2 className="text-lg">Batch {slug}</h2>
          {data.count > 0 && (
            <p className="hidden md:block text-sm text-gray-600 mt-2">
              Showing {offset + 1}-
              {Math.min(offset + ITEMS_PER_PAGE, data.count)} of {data.count}{" "}
              alumni
            </p>
          )}
        </div>
        <div className="w-full md:max-w-lg flex gap-2 items-center">
          <Input
            placeholder="Search alumni..."
            value={filter}
            onChange={handleSearchChange}
            disabled={isLoading || isPending}
          />
        </div>
        {data.count > 0 && (
          <p className="block md:hidden text-sm text-gray-600 mt-2">
            Showing {offset + 1}-{Math.min(offset + ITEMS_PER_PAGE, data.count)}{" "}
            of {data.count} alumni
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 pb-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F61A0]" />
          </div>
        ) : data.count > 0 ? (
          <>
            {data.data.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-md bg-[#2F61A0] flex items-center gap-5"
              >
                <div>
                  <Avatar className="h-24 w-24">
                    {user.avatar ? (
                      <AvatarImage
                        className="object-cover"
                        src={user.avatar || "/placeholder.svg"}
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-white">{user.course}</p>
                </div>
                <div className="ml-auto flex items-center">
                  <Link href={`/batch/${slug}/alumni/${user.id}`}>
                    <ArrowRight className="h-12 w-12 text-white" />
                  </Link>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/batch/${slug}/alumni`}
                showPageNumbers={true}
              />
            )}
          </>
        ) : (
          <EmptyState
            title={
              searchQuery
                ? "No alumni found"
                : `Batch ${slug} has no records of alumni`
            }
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Please check back later or contact the admin for more information."
            }
            redirectLabel="Go back"
            redirectPath="/batch"
          />
        )}
      </div>
    </div>
  );
}
