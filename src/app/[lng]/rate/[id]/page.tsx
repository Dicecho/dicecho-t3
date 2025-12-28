import { Card, CardContent } from "@/components/ui/card";
import { getDicechoServerApi } from "@/server/dicecho";
import { RateDetailClient } from "./rate-detail-client";

const RateDetailPage = async (
  props: {
    params: Promise<{ id: string }>;
  }
) => {
  const params = await props.params;

  const {
    id
  } = params;

  const api = await getDicechoServerApi();
  const rate = await api.rate.detail(id);

  return (
    <div className="container grid grid-cols-6 pt-4">
      <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
        <Card>
          <CardContent>
            <RateDetailClient initialRate={rate} rateId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RateDetailPage;
