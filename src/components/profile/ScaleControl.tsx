import { Slider } from "@/components/ui/slider";
import { ScaleControlProps } from "./types";

export const ScaleControl = ({ scale, onScaleChange }: ScaleControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-500">Zoom ({(scale * 100).toFixed(0)}%)</label>
        <span className="text-xs text-gray-400">{scale.toFixed(1)}x</span>
      </div>
      <Slider
        min={1}
        max={3}
        step={0.1}
        value={[scale]}
        onValueChange={([value]) => onScaleChange({ target: { value: value.toString() } })}
        className="w-full"
      />
    </div>
  );
};