// components/Filters.tsx
import React, { useState} from 'react';
import type { ChangeEvent } from 'react';
import './filters.css'

type Option = { value: string; label: string };

interface FiltersProps {
  countries: Option[];
  rounds: Option[];
  categories: Option[];
  onFilterChange?: (filters: FiltersState) => void;
}

type FiltersState = {
  country: string;
  round: string;
  category: string;
  search: string;
};

const Filters: React.FC<FiltersProps> = ({
  countries,
  rounds,
  categories,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FiltersState>({
    country: '',
    round: '',
    category: '',
    search: '',
  });

  // Handler for all dropdowns and search
  function handleChange(
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  }

  return (
    <div className="filters-container">
      <select
        name="country"
        value={filters.country}
        onChange={handleChange}
        className="filters-dropdown"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        name="round"
        value={filters.round}
        onChange={handleChange}
        className="filters-dropdown"
      >
        <option value="">All Rounds</option>
        {rounds.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="filters-dropdown"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        className="filters-search-box"
        placeholder="Search..."
        autoComplete="off"
      />
    </div>
  );
};

export default Filters;
