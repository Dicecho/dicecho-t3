import { RateItem } from "@/components/Rate/RateItem";
import { getDicechoServerApi } from "@/server/dicecho";

const RateDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const api = await getDicechoServerApi();
  const rate = await api.rate.detail(id);

  return (
    <div className="container grid grid-cols-6 pt-4">
      <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
        <RateItem rate={rate} />
      </div>
    </div>
  );
};

export default RateDetailPage;
