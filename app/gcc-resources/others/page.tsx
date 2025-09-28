import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { FaviconImage } from "@/components/favicon-image";

export const metadata: Metadata = {
  title: {
    absolute: "Other Resources | GCC Resources",
  },
};

const OTHER_RESOURCES = [
  {
    link: "https://open.spotify.com/show/48ijgGXWkrQI9CYqnXzgHB?si=6366e95881d645b9",
    label: "Spotify",
  },
  {
    link: "https://www.youtube.com/@gracecitychurch2245",
    label: "YouTube",
  },
  {
    link: "https://www.facebook.com/gccmorong",
    label: "Facebook",
  },
  {
    link: "https://www.google.com/maps/dir/14.4900096,121.2186624/grace+city+church/@14.5136365,121.2040979,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3397c1a3b7ace71d:0x58c1d14a081d35b7!2m2!1d121.2170619!2d14.5349839?entry=ttu",
    label: "Google Maps",
  },
  {
    link: "https://linktr.ee/gracecitychurchph",
    label: "Linktr.ee",
  },
];

function OtherResourcesPage() {
  return (
    <div className="min-h-[60vh]">
      <ul className="space-y-3">
        {OTHER_RESOURCES.map((resource) => (
          <li key={`gcc-${resource.label}`}>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <div className="group space-y-3 rounded-md border bg-card/60 py-3 hover:bg-card/80">
                <div className="flex items-center gap-2 px-3">
                  <div className="flex items-center gap-2">
                    <FaviconImage url={resource.link} />
                    <div>
                      <p className="font-semibold text-sm">{resource.label}</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <ExternalLinkIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OtherResourcesPage;
