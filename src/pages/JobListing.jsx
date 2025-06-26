import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();
  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });
  const { fn: fnCompanies, data: companies = [] } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, searchQuery, location, company_id]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) {
      setsearchQuery(query);
    }
  };

  const clearFilters = () => {
    setsearchQuery("");
    setLocation("");
    setCompany_id("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d399" />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-12">
        Latest Jobs
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex w-full gap-2 items-center mb-6"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title..."
          name="search-query"
          className="flex-1 h-14 px-4 text-md"
        />
        <Button type="submit" className="h-14 px-6 text-base" variant="blue">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full h-14">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="w-full h-14">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          onClick={clearFilters}
          className="w-full h-10"
        >
          Clear Filters
        </Button>
      </div>

      {/* Loader */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d399" />
      )}

      {/* Job Cards */}
      {!loadingJobs && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="text-center col-span-full text-lg text-gray-400">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
