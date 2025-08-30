import { useState, useMemo } from "react";

import { parseDate } from "../utils/date";

export function useFilterAndSort(posts) {
  const [filters, setFilters] = useState({
    postsByPlace: "",
    tripType: "all",
  });
  const [sorting, setSorting] = useState({
    sortBy: "date",
    sortDirection: "desc",
  });

  const toggleSort = (field) => {
    setSorting((prev) => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
        };
      }
      return { sortBy: field, sortDirection: "asc" };
    });
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const byPlace =
        filters.postsByPlace === "" || post.locality === filters.postsByPlace;
      const byType =
        filters.tripType === "all" ||
        (filters.tripType === "group" && post.company.length > 0) ||
        (filters.tripType === "solo" && post.company.length === 0);
      return byPlace && byType;
    });

    const sorted = [...filtered].sort((a, b) => {
      let result = 0;
      switch (sorting.sortBy) {
        case "date":
          result = parseDate(a.initialDate) - parseDate(b.initialDate);
          break;
        case "locality":
          result = a.locality.localeCompare(b.locality);
          break;
        case "duration":
          const durationA = parseDate(a.finalDate) - parseDate(a.initialDate);
          const durationB = parseDate(b.finalDate) - parseDate(b.initialDate);
          result = durationA - durationB;
          break;
      }
      return sorting.sortDirection === "asc" ? result : -result;
    });

    return sorted;
  }, [posts, filters, sorting]);

  return { filters, setFilters, sorting, toggleSort, filteredAndSortedPosts };
}
