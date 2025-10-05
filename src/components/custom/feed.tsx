import { Icon } from "@iconify/react";
import {
  getInformation,
  readAlumniMemoriesAction,
  readAnnouncementsAction,
  readEventsAction,
  readHighlightsAction,
  readJobsAction,
  readPostsAction,
  readUserLocationAction,
} from "@/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState, Button } from "@/components";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import dynamic from "next/dynamic";
import MiniAnnouncementCard from "./mini-announcment-card";

// import   StarRating   from "./star-rating";
// import { StatusSelection } from

const StarRating = dynamic(() => import("./star-rating"), {
  loading: () => <p>Loading...</p>,
});
const StatusSelection = dynamic(() => import("./status-selection"), {
  loading: () => <p>Loading...</p>,
});
const AlumniMap = dynamic(() => import("./alumni-map"), {
  loading: () => <p>Loading...</p>,
});
const EventCard = dynamic(() => import("./event-card"), {
  loading: () => <p>Loading...</p>,
});
const RecentPostsSection = dynamic(() => import("./recent-posts-section"), {
  loading: () => <p>Loading...</p>,
});

export async function Feed() {
  const user = await getInformation();
  const upcomingEvents = await readEventsAction({
    status: ["Upcoming Event"],
    pagination: {
      limit: 3,
      page: 0,
    },
  });
  const ongoingEvents = await readEventsAction({
    status: ["Ongoing Event"],
    pagination: {
      limit: 3,
      page: 0,
    },
  });
  const information = await getInformation();
  const posts = await readPostsAction({
    pagination: {
      page: 0,
      limit: 5,
    },
    order: "desc",
    orderBy: "createdAt",
  });
  const jobs = await readJobsAction({
    pagination: {
      limit: 3,
      page: 0,
    },
    order: "desc",
    status: ["OPEN"],
    orderBy: "createdAt",
  });
  const highlights = await readHighlightsAction({
    pagination: {
      limit: 3,
      page: 0,
    },
  });

  const locations = await readUserLocationAction();
  const images = await readAlumniMemoriesAction(6);
  const announcemenets = await readAnnouncementsAction({
    orderBy: "createdAt",
    order: "desc",
    pagination: {
      limit: 3,
      page: 0,
    },
  });

  return (
    <div className="container mx-auto ">
      <section className="space-y-2 bg-[#15497A] py-10    px-5 md:px-10">
        <h1 className="text-white text-2xl md:text-3xl capitalize font-bold">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-white md:text-xl">
          Stay connected with your fellow alumni and explore opportunities!
        </p>
      </section>

      <section className="md:px-10 px-5 py-8 space-y-3">
        <div className="container mx-auto ">
          <Link
            href="/posts/add"
            className="mx-auto lg:max-w-screen-md  flex items-start gap-5 lg:col-span-1 bg-white   rounded-md  shadow-md p-5 w-full"
          >
            <Avatar className="border border-gray-100">
              {/*{user?.avatar && <AvatarImage src={user?.avatar || ""} />}*/}
              <AvatarFallback className="capitalize">
                {user?.firstName.charAt(0)}
                {user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-500 dark:text-black border w-full border-gray-900/30 rounded-xl p-4">
              What&apos;s on your mind?
            </p>
          </Link>
        </div>
        <div className="container mx-auto  grid grid-cols-1   lg:grid-cols-3 gap-4">
          <div className="bg-white space-y-2 rounded-md  shadow-md p-5 w-full min-w-[80d%] md:min-w-[40d%]">
            <h2 className="font-medium dark:text-black">Where are you now?</h2>
            <StatusSelection initialValue={information?.occupationStatus} />
          </div>
          <Link
            href="/announcements/add"
            className="  flex items-start gap-3 lg:col-span-1 bg-white   rounded-md  shadow-md p-5 w-full"
          >
            <Bell className="min-h-8 min-w-8 border  p-1.5 rounded-full" />
            <p className="text-gray-500 dark:text-black border w-[80%] md:w-full border-gray-900/30 rounded-xl p-4">
              Post an announcement
            </p>
          </Link>
          <div className="bg-white space-y-2 rounded-md shadow-md p-5 w-full min-w-[80d%] md:min-w-[40d%]">
            <h2 className="font-medium dark:text-black">
              How did BU Connect help you?
            </h2>
            <div className="flex justify-center items-center gap-2">
              <StarRating
                size="lg"
                initialRating={information?.rate || 0}
                className="  "
                hideRate
              />
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="md:px-10 px-5 py-8">
        <div className="flex items-center gap-2">
          <Icon icon="noto:confetti-ball" width="32" height="32" />
          <h1 className="font-poppins   text-2xl md:text-3xl font-bold  text-[#E6750C]  ">
            Upcoming Events
          </h1>
        </div>
        {ongoingEvents.data.length > 0 || upcomingEvents.data.length > 0 ? (
          <div className="grid mt-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingEvents.data.length > 0 &&
              ongoingEvents.data.map((event) => (
                <EventCard key={event.slug} {...event} />
              ))}
            {upcomingEvents.data.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <EmptyState showRedirectButton={false} />
          </div>
        )}
      </section>

      {/*<section>
        <PostsInfiniteScroll defaultData={posts.data} />
      </section>*/}

      <section className="mx-auto container bg-[#195287] md:px-10 px-5 pt-10">
        {/* JOB AND HIGHLIGHTS */}
        <div className="grid md:grid-cols-2 md:gap-10 gap-5">
          <div
            id="jobs"
            className="p-5 md:p-10 space-y-3 bg-white  rounded-lg shadow-sm max-h-min"
          >
            <h1 className="font-poppins text-2xl md:text-3xl font-bold  text-[#E6750C]  ">
              Job Opportunities
            </h1>
            <div>
              {jobs.data.length > 0 ? (
                jobs.data.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex gap-2 items-start">
                      <Icon
                        icon="fluent:briefcase-search-24-filled"
                        width="24"
                        height="24"
                        style={{ color: "#195287" }}
                      />
                      <div>
                        <h4 className="font-bold text-[#195287]">
                          {job.jobTitle}
                        </h4>
                        <p className="text-sm text-[#195287]">
                          {formatDistanceToNowStrict(job.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col min-h-[200px] items-center justify-center">
                  <Icon
                    icon="mage:folder-cross"
                    width="50"
                    height="50"
                    style={{ color: "#195287" }}
                  />
                  <p>No jobs found!</p>
                </div>
              )}
            </div>
          </div>

          <div
            id="highlights"
            className="p-5 md:p-10 space-y-3 bg-white rounded-lg shadow-sm"
          >
            <h1 className="font-poppins text-2xl md:text-3xl font-bold  text-[#E6750C]  ">
              Highlights
            </h1>
            <div>
              {highlights.length > 0 ? (
                highlights.map((highlight) => {
                  if ("question" in highlight) {
                    return (
                      <Link
                        href={`/highlights/polls/${highlight.id}`}
                        key={`link-poll-highlight-#${highlight.id}`}
                      >
                        <div
                          className="flex gap-2"
                          key={`poll-highlight-#${highlight.id}`}
                        >
                          <Icon
                            icon="fluent-color:poll-20"
                            width="24"
                            height="24"
                          />
                          <div>
                            <h4 className="text-lg font-semibold">
                              {highlight.question}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(highlight.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  } else if ("recruiting" in highlight) {
                    return (
                      <Link
                        href={`/highlights/recruitments/${highlight.id}`}
                        key={`link-recruitment-highlight-#${highlight.id}`}
                      >
                        <div
                          className="flex gap-2"
                          key={`recruitment-highlight-#${highlight.id}`}
                        >
                          <Icon
                            icon="hugeicons:job-search"
                            width="24"
                            height="24"
                          />
                          <div>
                            <h4 className="text-lg font-semibold">
                              {highlight.recruiting}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(highlight.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <div className="flex flex-col min-h-[100px] items-center justify-center">
                  <Icon
                    icon="mage:folder-cross"
                    width="50"
                    height="50"
                    style={{ color: "#195287" }}
                  />
                  <p>No highlights found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <RecentPostsSection defaultData={posts.data} />

        <div id="announcements" className=" container mx-auto  mt-5">
          <div className="flex  items-center gap-3 justify-center mb-5">
            <Icon
              icon="fluent-color:megaphone-loud-16"
              width="24"
              height="24"
            />
            <h1 className="font-poppins text-[#E6750C] text-2xl font-bold  ">
              News &#x26; Announcements
            </h1>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 ">
            {announcemenets.data.length > 0 ? (
              announcemenets.data.map((announcement) => (
                <MiniAnnouncementCard
                  announcement={announcement}
                  key={announcement.id}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full min-h-[300px] md:col-span-3">
                {/*<Loader2 className="h-20 animate-spin" />*/}
                <div className="flex flex-col items-center gap-3">
                  <Icon
                    icon="mage:folder-cross"
                    width="100"
                    height="100"
                    color="#FFFFFF"
                  />
                  <p className="text-white text-lg">No Announcements Found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="alumni-memories"
        className="bg-[#195287] md:px-10 px-5 pb-10"
      >
        {images.length > 0 && (
          <div className=" container mx-auto   py-5">
            <div className="flex  items-center gap-3 justify-center">
              <Icon
                icon="fluent-emoji-flat:camera-with-flash"
                width="24"
                height="24"
              />
              <h1 className="text-[#E6750C] font-poppins text-2xl font-bold capitalize">
                Alumni Memories
              </h1>
            </div>

            <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
              {images.map((image, index) => (
                <div
                  key={`Alumni Memory Card #${index + 1}`}
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "408px",
                  }}
                >
                  <Image
                    src={image || "/images/placeholder.jpg"}
                    alt={`Alumni Memory ${index + 1}`}
                    width={408}
                    height={375}
                    layout="responsive"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <h1 className="font-poppins   text-2xl text-[#E6750C] mb-5 md:text-3xl font-bold text-center ">
          Alumni Map
        </h1>
        <div className="p-5">
          <AlumniMap initialMarkers={locations || []} />
        </div>
      </section>
      {/* <InfiniteScroll defaultData={events.data} moreData={events.hasMore} /> */}
    </div>
  );
}
