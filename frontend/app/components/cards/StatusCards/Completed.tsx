import { CheckCircle } from "lucide-react";

type Props = {
  count: number;
};

export default function Completed({ count }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-card p-5 flex flex-col gap-2 shadow-[0_0_8px_2px_rgba(139,92,246,0.08)] hover:shadow-[0_0_12px_3px_rgba(139,92,246,0.18)] transition-all duration-500 ease-in-out">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-green-500" />
        Completed
      </div>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}