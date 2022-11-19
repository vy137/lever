import { PropsWithChildren } from "react";
import Handle from "./Handle";

export type SliderStepProps = {
  index: number;
  selected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function SliderStep(props: SliderStepProps) {
  const stepIndicatorWidthPx = (() => {
    const [baseWidth, growFactor] = [20, 6];
    return Math.round(baseWidth + growFactor * Math.abs(props.index));
  })();
  const step = <div className="step" style={{ width: stepIndicatorWidthPx }} />;

  const Parent = (
    props: PropsWithChildren<SliderStepProps> & { className: string }
  ) =>
    props.selected ? (
      <div children={props.children} className={props.className} />
    ) : (
      <button
        children={props.children}
        className={`${props.className} buttonReset`}
        onClick={props.onClick}
      />
    );

  return (
    <Parent
      index={props.index}
      selected={props.selected}
      onClick={props.onClick}
      className={"handleSliderContainer"}
    >
      {props.selected ? <div /> : step}
      <div className="handleSlider">{props.selected && <Handle />}</div>
      {props.selected ? <div /> : step}
    </Parent>
  );
}
