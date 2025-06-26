import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-markdown-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/ApplyJobDrawer";
import ApplicationCard from "@/components/ApplicationCard";

import useFetch from "@/hooks/useFetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      {/* Title & Company Logo */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-center md:text-left">
          {job?.title}
        </h1>
        <img
          src={job?.company?.logo_url}
          className="h-16 w-auto object-contain"
          alt={job?.title}
        />
      </div>

      {/* Location | Applicants | Status */}
      <div className="flex flex-wrap gap-4 justify-between items-center border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="size-5" />
          <span>{job?.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="size-5" />
          <span>{job?.applications?.length} Applicants</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          {job?.isOpen ? (
            <>
              <DoorOpen className="size-5 text-green-500" />
              <span className="text-green-500 font-medium">Open</span>
            </>
          ) : (
            <>
              <DoorClosed className="size-5 text-red-500" />
              <span className="text-red-500 font-medium">Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Hiring Status for recruiter */}
      {job?.recruiter_id === user?.id && (
        <div>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full h-12 text-lg font-medium ${
                job?.isOpen
                  ? "bg-green-950 text-green-100"
                  : "bg-red-950 text-red-100"
              }`}
            >
              <SelectValue
                placeholder={`Hiring Status ${
                  job?.isOpen ? "( Open )" : "( Closed )"
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* About Job */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">About the job</h2>
        <p className="text-base sm:text-lg text-gray-300">{job?.description}</p>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          What we are looking for
        </h2>
        <MDEditor.Markdown
          source={job?.requirements}
          className="prose prose-invert prose-li:marker:text-blue-500 prose-ul:pl-6 prose-ul:list-disc prose-p:text-gray-300 sm:prose-lg max-w-none bg-transparent"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      {/* Apply button for candidates */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {/* Loader while status updating */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      {/* Applications List */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div>
          <h2 className="font-bold text-2xl mb-4">Applications</h2>
          <div className="flex flex-col gap-4">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;
