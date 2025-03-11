import { Card } from "@/components/ui/card";
import { Advertisement } from "@/types/advertisement";

interface AdvertisementCarouselItemProps {
  advertisement: Advertisement;
}

export const AdvertisementCarouselItem = ({ advertisement }: AdvertisementCarouselItemProps) => {
  return (
    <a
      href={advertisement.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="overflow-hidden">
        <div className="relative h-96">
          {advertisement.image_url && (
            <>
              <img
                src={advertisement.image_url}
                alt={advertisement.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {advertisement.title}
            </h2>
            <p className="text-xl text-white/90">
              {advertisement.description}
            </p>
          </div>
        </div>
      </Card>
    </a>
  );
};
