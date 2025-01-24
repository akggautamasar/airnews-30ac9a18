interface AdvertisementErrorStateProps {
  message: string;
}

export const AdvertisementErrorState = ({ message }: AdvertisementErrorStateProps) => {
  return (
    <div className="text-center py-8 text-red-500">
      {message}
    </div>
  );
};