import { useRef, useState } from "react";
import "./styles.scss";
import SliderStep from "./components/SliderStep";
import { useCachedValue } from "./lib/cache";

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

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lastTimeOutId, setLastTimeOutId] = useState(
    undefined as undefined | number
  );

  const [initialValue, updateInitialValue, initialValueRef] = useCachedValue(
    "initialValue",
    2
  );

  const [upFactor, updateUpFactor, upFactorRef] = useCachedValue("upFactor", 3);

  const [downFactor, updateDownFactor, downFactorRef] = useCachedValue(
    "downFactor",
    2
  );

  const [powerOut, setPowerOut] = useState(initialValue);

  const { actionLog, addToActionLog, resetActionLog } = useActionLog([]);
  console.log(actionLog);

  const getDiff = (index: number) => {
    const isUp = index > 0;
    const factor = isUp ? upFactor : downFactor;
    const absDiff = Math.pow(factor, Math.abs(index));
    return isUp ? absDiff : -absDiff;
  };

  const updatePowerOut = (index: number) => {
    if (index === 0) return;
    const newPowerOut = powerOut + getDiff(index);
    setPowerOut(newPowerOut);

    addToActionLog({
      date: Date.now(),
      oldPowerOut: powerOut,
      newPowerOut: newPowerOut,
      diff: newPowerOut - powerOut,
      actuationIndex: index,
      upFactor,
      downFactor,
      initialPowerOut: actionLog[0]?.initialPowerOut ?? powerOut,
    });
  };

  return (
    <>
      <div className="leftSide">
        {actionLog.map((action) => {
          return <div className="logItem" key={action.date}></div>;
        })}
      </div>
      <div className="rightSide">
        <div className="controlGrid">
          <div className="controlForm">
            <p>up factor</p>
            <input
              type="number"
              ref={upFactorRef}
              onChange={() => {
                updateUpFactor(upFactorRef.current?.valueAsNumber ?? upFactor);
                resetActionLog;
              }}
              defaultValue={upFactor}
            />
          </div>
          <div className="controlForm">
            <p>down factor</p>
            <input
              type="number"
              ref={downFactorRef}
              onChange={() => {
                updateDownFactor(
                  downFactorRef.current?.valueAsNumber ?? downFactor
                );
                resetActionLog();
              }}
              defaultValue={downFactor}
            />
          </div>
          <div className="controlForm">
            <p>initial</p>
            <input
              type="number"
              ref={initialValueRef}
              onChange={() => {
                updateInitialValue(
                  initialValueRef.current?.valueAsNumber ?? initialValue
                );
              }}
              defaultValue={initialValue}
            />
          </div>
          <button
            className="buttonReset resetButton"
            onClick={() => {
              setPowerOut(initialValue);
              resetActionLog();
            }}
          >
            <p>reset</p>
          </button>
        </div>

        <div className="deviceContainer">
          <div className="controlsContainer">
            {steps.map(({ index }) => (
              <SliderStep
                index={index}
                selected={index === selectedIndex}
                diff={getDiff(index)}
                onClick={() => {
                  window.clearTimeout(lastTimeOutId);
                  setSelectedIndex(index);

                  // Reset handle
                  const timeoutId = window.setTimeout(() => {
                    setSelectedIndex(0);
                  }, 600);
                  setLastTimeOutId(timeoutId);

                  // Do the thing
                  updatePowerOut(index);
                }}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="gauge">
          <h1>{powerOut}</h1>
        </div>
      </div>
    </>
  );
}

export default App;

type GaugeAction = {
  date: number;
  oldPowerOut: number;
  newPowerOut: number;
  diff: number;
  actuationIndex: number;
  upFactor: number;
  downFactor: number;
  initialPowerOut: number;
};

function useActionLog(initial: GaugeAction[]) {
  const [actionLog, setActionLog] = useState(initial);
  const addToActionLog = (action: GaugeAction) =>
    setActionLog(actionLog.concat(action));
  const resetActionLog = () => setActionLog([]);

  return { actionLog, setActionLog, addToActionLog, resetActionLog };
}
