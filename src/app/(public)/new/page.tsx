import { Communities } from "@/shared/ui/New/Communities";
import { Pagination } from "@/shared/ui/New/Pagination";
import { SkatersHeader } from "@/shared/ui/New/Skaters";
import { SkaterGrid } from "@/shared/ui/New/Skaters/Grid";

export default function NewPage() {
  return (
    <div>
      <SkatersHeader />
      <SkaterGrid />
      <Pagination />
      <Communities />
    </div>
  );
}
