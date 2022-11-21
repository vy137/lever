import { useRef, useState } from "react";
import "./styles.scss";
import SliderStep from "./components/SliderStep";
import { cache } from "./cachedValues";

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

  const [initialValue, setInitialValue] = useState(cache.initialValue ?? 2);
  localStorage.setItem("initialValue", initialValue.toString());
  const initialValueRef = useRef<HTMLInputElement>(null);

  const [upFactor, setUpFactor] = useState(cache.upFactor ?? 3);
  localStorage.setItem("upFactor", upFactor.toString());
  const upFactorRef = useRef<HTMLInputElement>(null);

  const [downFactor, setDownFactor] = useState(cache.downFactor ?? 2);
  localStorage.setItem("downFactor", downFactor.toString());
  const downFactorRef = useRef<HTMLInputElement>(null);

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
                setUpFactor(upFactorRef.current?.valueAsNumber ?? upFactor);
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
                setDownFactor(
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
                setInitialValue(
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
