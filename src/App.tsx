import { PropsWithChildren, useState } from "react";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);
  const steps = [
    { index: 4 },
    { index: 3 },
    { index: 2 },
    { index: 1 },
    { index: 0 },
    { index: -1 },
    { index: -2 },
    { index: -3 },
    { index: -4 },
    { index: -5 },
  ];
  const selectedIndex = 2;

  return (
    <>
      <div className="deviceContainer">
        <div className="controlsContainer">
          {steps.map(({ index }) => (
            <Thing
              index={index}
              selected={index === selectedIndex}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

type ThingProps = {
  index: number;
  selected: boolean;
};
function Thing(props: PropsWithChildren<ThingProps>) {
  const stepIndicatorWidthPx = (() => {
    const [baseWidth, growFactor] = [20, 6];
    return Math.round(baseWidth + growFactor * Math.abs(props.index));
  })();
  const step = <div className="step" style={{ width: stepIndicatorWidthPx }} />;

  return (
    <div className="handleSliderContainer">
      {props.selected ? <div /> : step}
      <div className="handleSlider">{props.selected && <Handle />}</div>
      {props.selected ? <div /> : step}
    </div>
  );
}

function Handle() {
  return <div className="handle" />;
}
