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

  // When you have to do shit
  const handlePowerOut = (index: number) => {
    if (index === 0) return;
    const factor = index > 0 ? upFactor : downFactor;
    const buffer = Math.pow(factor, Math.abs(index));
    const addition = index > 0 ? buffer : -buffer;

    setPowerOut(powerOut + addition);
  };

  return (
    <>
      <div className="controlGrid">
        <div className="controlForm">
          <p>up factor</p>
          <input
            type="number"
            ref={upFactorRef}
            onChange={() =>
              setUpFactor(upFactorRef.current?.valueAsNumber ?? upFactor)
            }
            defaultValue={upFactor}
          />
        </div>
        <div className="controlForm">
          <p>down factor</p>
          <input
            type="number"
            ref={downFactorRef}
            onChange={() =>
              setDownFactor(downFactorRef.current?.valueAsNumber ?? downFactor)
            }
            defaultValue={downFactor}
          />
        </div>
        <div className="controlForm">
          <p>initial</p>
          <input
            type="number"
            ref={initialValueRef}
            onChange={() =>
              setInitialValue(
                initialValueRef.current?.valueAsNumber ?? initialValue
              )
            }
            defaultValue={initialValue}
          />
        </div>
        <button
          className="buttonReset resetButton"
          onClick={() => setPowerOut(initialValue)}
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
              onClick={() => {
                window.clearTimeout(lastTimeOutId);
                setSelectedIndex(index);

                // Reset handle
                const timeoutId = window.setTimeout(() => {
                  setSelectedIndex(0);
                }, 600);
                setLastTimeOutId(timeoutId);

                // Do the thing
                handlePowerOut(index);
              }}
              key={index}
            />
          ))}
        </div>
      </div>

      <div className="gauge">
        <h1>{powerOut}</h1>
      </div>
    </>
  );
}

export default App;
