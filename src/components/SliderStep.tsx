import Handle from "./Handle";

export type SliderStepProps = {
  index: number;
  selected: boolean;
  diff: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function SliderStep(props: SliderStepProps) {
  const stepIndicatorWidthPx = (() => {
    const [baseWidth, growFactor] = [20, 6];
    return Math.round(baseWidth + growFactor * Math.abs(props.index));
  })();
  const step = <div className="step" style={{ width: stepIndicatorWidthPx }} />;

  // const [hovering, setHovering] = useState(false);

  // const signNum = (num: number) => (num > 0 ? `+${num}` : num.toString());
  // const stepDisplay = hovering ? signNum(props.diff) : Math.abs(props.index);
  const stepDisplay = Math.abs(props.index).toString();

  return (
    <button
      className="handleSliderContainer buttonReset"
      onMouseUp={(e) => {
        // setHovering(false);
        props.onClick(e);
      }}
      // onMouseEnter={() => setHovering(true)}
      // onMouseLeave={() => setHovering(false)}
    >
      {props.selected ? <div /> : step}
      <div className="handleSlider">
        {props.selected ? <Handle /> : <p className="stepIndex">{stepDisplay}</p>}
      </div>
      {props.selected ? <div /> : step}
    </button>
  );
}
