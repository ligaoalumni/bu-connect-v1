"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown, Building2 } from "lucide-react";
import { useDebounce } from "use-debounce";

interface University {
  name: string;
  country?: string;
  alpha_two_code?: string;
  "state-province"?: string | null;
  domains?: string[];
  web_pages?: string[];
}

interface PostStudySlideProps {
  value?: string;
  handleUniversityChange: (value: string) => void;
}

export default function PostStudySlide({
  handleUniversityChange,
  value,
}: PostStudySlideProps) {
  const [query, setQuery] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(value ? { name: value } : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setUniversities([]);
      setIsOpen(false);
      return;
    }

    const searchUniversities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/universities?name=${debouncedQuery}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch universities");
        }

        const data: University[] = await response.json();
        setUniversities(data.slice(0, 10));
        setIsOpen(true);
      } catch {
        setError("Failed to search universities. Please try again.");
        setUniversities([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    searchUniversities();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUniversity = (university: University) => {
    setSelectedUniversity(university);
    setQuery(university.name);
    handleUniversityChange(university.name);
    setIsOpen(false);
    setUniversities([]);
  };

  const handleClearSelection = () => {
    setSelectedUniversity(null);
    setQuery("");
    setUniversities([]);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear selection if user starts typing again
    if (selectedUniversity && value !== selectedUniversity.name) {
      setSelectedUniversity(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Universities</label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Type to search universities..."
              value={query}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              onFocus={() => {
                if (universities.length > 0) {
                  setIsOpen(true);
                }
              }}
            />
            {(query || selectedUniversity) && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={handleClearSelection}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {!query && !selectedUniversity && (
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            )}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border rounded-md shadow-lg z-10">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Searching...</span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-md shadow-lg z-10">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Dropdown results */}
          {isOpen && universities.length > 0 && !isLoading && (
            <Card className="absolute top-full left-0 right-0 mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {universities.map((university, index) => (
                  <div
                    key={`${university.name}-${index}`}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => handleSelectUniversity(university)}
                  >
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {university.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {university.country}
                          </Badge>
                          {university["state-province"] && (
                            <span className="text-xs text-gray-500">
                              {university["state-province"]}
                            </span>
                          )}
                        </div>
                        {university.domains &&
                          university.domains.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {university.domains[0]}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* No results message */}
          {isOpen &&
            universities.length === 0 &&
            !isLoading &&
            query.trim().length > 0 &&
            !error && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border rounded-md shadow-lg z-10">
                <p className="text-sm text-gray-600 text-center">
                  No universities found for &quot;{query}&quot;
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Selected university display */}
      {selectedUniversity && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {selectedUniversity.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge>{selectedUniversity.country}</Badge>
                {selectedUniversity["state-province"] && (
                  <Badge variant="outline">
                    {selectedUniversity["state-province"]}
                  </Badge>
                )}
              </div>
              {selectedUniversity.domains &&
                selectedUniversity.domains.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Domains:
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUniversity.domains.map((domain, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              {selectedUniversity.web_pages &&
                selectedUniversity.web_pages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Website:
                    </p>
                    <a
                      href={selectedUniversity.web_pages[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedUniversity.web_pages[0]}
                    </a>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
