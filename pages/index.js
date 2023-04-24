import Head from 'next/head';
import Image from 'next/image';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import React from 'react';
import { useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDarkReasonable as theme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const outfit = Outfit({ subsets: ['latin'] })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] });
const REDUCE_RATE = 1;
const X_AMPLIFY_FACTOR = 600;
const DIFF_X = 0.53;
const MAX_END_TIME = 5.00;
const INIT_VARS = {
  endTime: 5.00,
  deltaT: 0.001,
  dur: 0.01,
  inPoint: 1.00,
  startVal: 450,
  endVal: 545,
  freq: 7,
  decay: 3,
  reduceRate: 1
}

function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function makePercentage({ value, max }) {
  const percentage = `${String(Math.round((value / max) * 100))}%`;
  return percentage
}

function ResetButton(props) {
  return (
    <Button onClick={props.handler}
      whileHover={{ scale: 1.03, transition: { duration: 0.3, } }} whileTap={{ scale: 1.00, transition: { duration: 0.05, ease: 'linear' } }}
    >{props.children || "Reset"}</Button>
  )
}


const jetBrainsApplier = styled.div`
font-family: ${jetBrainsMono.family} !important;
`
//text-white font-bold text-md w-32 bg-neutral-700 py-3 px-4 rounded-full
const Button = styled(motion.button)`
  color: white;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  /* width: 8em;
  height:  */
  background-color: #404040;
  padding: 0.4em 1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin:0.6em;
`


const Container = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 3rem 1em;
    padding: 1em 1em;
    @media (min-width: 1280px) {
      margin: 3rem 15vw;
    }
`;

// const StyledHightlight = styled(Highlight)`
//   /* background-color: hsl(0, 0%, 10%); */
//   border-radius: 18px;
//   font-size: 1.2em;
//   .hljs{

//   }
// `

const OptionsContainer = styled.div`

  gap: 1.5em 2em;
  width: 100%;
  max-width: 90vw;
  margin: 1em;
  @media (min-width: 1280px) {
    display: grid;
  grid-template-columns: 1fr 1fr;
    max-width: 80vw;
  }
  align-items: center;
`;

const OptionContainer = styled.div`
    display: flex;
    flex-direction: column;
  `;


const OptionTitleAndValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.5em;
`;

const OptionTitle = styled.p`
   font-size: 1.2em;
   font-weight: bold;
   color: white;
   padding-left: 0.4em;
`;

const OptionValue = styled.p`
   font-size: 1.2em;
   color: whitesmoke;
`;

const RangeAndReset = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const OptionResetButton = styled(ResetButton)`
  align-items: center;
  justify-content: center;
`;


const BigResetButton = styled(Button)`
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 18px;
  background-color: hsl(0, 0%, 10%);
`;


const Title = styled.h1`
  font-size: 3rem;
  color: white;
  `;


const Range = styled.input`
appearance: none;
width: 100%;
background-color: transparent;
margin:  0.6em;
height: 0.5em;
border-radius: 9999px;
accent-color: #f5f5f5;
cursor: pointer;
background-image: linear-gradient(to right, #ec4899 0%, #ec4899 ${makePercentage}, #404040 ${makePercentage}, #404040 100%);
`;

const NumInput = styled.input`
  /* --input-focus-border: #ec4899; */
  appearance: none;
  margin: 0.6em;
  height: 2rem;
  border-radius: 10px;
  border: none;
  outline: 0;
  background: #404040;
  color: white;
  width: 4.5rem;
  font-family: ${outfit.className};
  font-weight: bold;
  font-size: 0.9rem;
  text-align: left;
  padding: 0 0 0 0.8rem;
  :focus{
    /* transition: "0 0 0 1px 1em .2s, #EC4899 .2s,background .2s, inset 0 0 0 1px #EC4899 .2s"  */
    /* inset: 0 0 0 1px 1em #EC4899; */
    box-shadow: inset 0 0 0 1px #EC4899;
    outline-width: 0;
  }
  /* ::-webkit-input-placeholder{
      opacity:0.5;
  } */
  ::-webkit-textfield-decoration-container{

    
  }
  ::-webkit-inner-spin-button{
    position: absolute;
    top: 1px;
    right: 1px;
    display: block;
    width: 1.5rem;
    height: calc(100% - 2px);
    padding: 0;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg fill='%23FFFFFF' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='-149.35 -149.35 851.86 851.86' xml:space='preserve' stroke='%23FFFFFF'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cg%3E%3Cg%3E%3Cpath d='M351.082,395.509h-149.01c-12.02,0-16.934,8.464-10.979,18.904l74.695,130.913c5.955,10.44,15.619,10.44,21.573,0 l74.701-130.919C368.022,403.973,363.101,395.509,351.082,395.509z'%3E%3C/path%3E%3Cpath d='M287.366,7.831c-5.954-10.441-15.618-10.441-21.572,0L191.092,138.75c-5.955,10.44-1.04,18.904,10.979,18.904h149.01 c12.02,0,16.934-8.464,10.979-18.904L287.366,7.831z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    border-bottom-right-radius: 14px;
    border-top-right-radius: 14px;
    cursor: pointer;
    opacity:1;
    text-align: center;
  }
`;

const NumInputVariants = {
  // activate:{transition: "0 0 0 1px 1em .2s, #EC4899 .2s,background .2s,-webkit-box-shadow .2s"}
  enable: {},
  disable: {

  }
}

function NumInputWithMotion({ min, max, step, onChange, value }) {
  return (
    <NumInput type="number" animate={NumInputVariants.disable} min={min} max={max} step={step} onChange={onChange} value={value} numberLength={String(value).length} />
  )
}

function BigResetButtonWithMotion(props) {
  return (
    <BigResetButton
      whileHover={{ scale: 1.03, backgroundColor: "#404040", transition: { duration: 0.3, } }} whileTap={{ scale: 1.00, backgroundColor: "#404040", transition: { duration: 0.05, ease: 'linear' } }} onClick={props.handler}>{props.children}</BigResetButton>
  )
}

export default function Home() {
  const [config, setConfig] = React.useState(INIT_VARS);
  const [graph, setGraph] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  useEffect(() => {
    function drawGraph() {
      const { endTime, deltaT, dur, inPoint, startVal, endVal, freq, decay, reduceRate } = config;
      let howToMove = [];
      let time = 0.00;

      let t = time - inPoint;
      /* draw at t < dur */
      for (; t <= dur; time += deltaT, t = time - inPoint) {
        const progress = (time / dur);
        howToMove.push([time * DIFF_X * X_AMPLIFY_FACTOR, (1200 - (easeInOutSine(progress) * (endVal - startVal)) + startVal) * config.reduceRate])
      }

      /* draw at time <=3.0 */
      for (; time <= endTime; time += deltaT, t = time - inPoint) {
        const amp = ((endVal - startVal) / dur);
        const w = freq * Math.PI
        const dst = -((endVal) + amp * (Math.sin((t - dur) * w) / Math.exp(decay * (t - dur)) / w)) * config.reduceRate;
        howToMove.push([time * DIFF_X * X_AMPLIFY_FACTOR, dst])
      }

      let pathStr = `M ${howToMove[0][0]} ${howToMove[0][1]} `;
      const points = [];
      for (let i = 1; i < howToMove.length - 2; i++) {
        pathStr += `Q ${howToMove[i + 1][0]} ${howToMove[i + 1][1]} ${howToMove[i + 2][0]} ${howToMove[i + 2][1]} `
        if (i % 10 == 0) {
          const point = <circle className='point' cx={howToMove[i + 1][0]} cy={howToMove[i + 1][1]} r={5} fill='transparent'></circle>
          points.push(point);
        }
      }
      const graph =
        <motion.svg className='p-1' viewBox={`150 ${-endVal * 2} 1600 ${1200 * REDUCE_RATE * REDUCE_RATE}`} fill='transparent'>
          <path d={pathStr} stroke='white' strokeWidth="10"></path>
        </motion.svg>
      return graph
    }
    setGraph(drawGraph());
  }, [refreshKey, config])
  return (
    <Container className={`${outfit.className}`} >
      <Title>After Effect Overshoot Expression Simulator</Title>
      {graph}
      <SyntaxHighlighter language='javascript' style={theme} wrapLines wrapLongLines customStyle={{
        borderRadius: "18px",
        backgroundColor: "#222222",
        padding: "3.2em",
        fontSize: "1em",
        "span": {
          "font-family": outfit.className
        }
      }}
      
      codeTagProps={{ className: jetBrainsMono.className }}
      >
        {`freq = ${config.freq}
decay = ${config.decay}
t = time - inPoint
startVal = [${config.startVal}]
endVal = [${config.endVal}]
dur = ${config.dur}

if (t < dur) {
  ease(t, 0, dur, startVal, endVal);
} else {
  amp = (endVal - startVal) / dur;
  w = freq * Math.PI
  endVal + amp * (Math.sin((t - dur) * w) / Math.exp(decay * (t - dur)) / w);`}
      </SyntaxHighlighter>
      <OptionsContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>End time: </OptionTitle>
            <OptionValue>{config.endTime}s</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, endTime: parseFloat(e.target.value) })} value={config.endTime} endTime={config.endTime} />
            <NumInputWithMotion type='number' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, endTime: parseFloat(e.target.value) })} value={config.endTime} />
            <OptionResetButton handler={() => setConfig({ ...config, endTime: INIT_VARS.endTime })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>inPoint: </OptionTitle>
            <OptionValue>{config.inPoint}s</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, inPoint: parseFloat(e.target.value) })} value={config.inPoint} />
            <NumInputWithMotion type='number' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, inPoint: parseFloat(e.target.value) })} value={config.inPoint} />
            <OptionResetButton handler={() => setConfig({ ...config, inPoint: INIT_VARS.inPoint })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Duration: </OptionTitle>
            <OptionValue>{config.dur}s</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.00' max='0.50' step='0.0001' onChange={(e) => setConfig({ ...config, dur: parseFloat(e.target.value) })} value={config.dur} />
            <NumInputWithMotion min='0.00' max='0.50' step='0.0001' onChange={(e) => setConfig({ ...config, dur: parseFloat(e.target.value) })} value={config.dur} />
            <OptionResetButton handler={() => setConfig({ ...config, dur: INIT_VARS.dur })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Delta T: </OptionTitle>
            <OptionValue>{config.deltaT}s</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.001' max='1.00' step='0.00001' onChange={(e) => setConfig({ ...config, deltaT: parseFloat(e.target.value) })} value={config.deltaT} />
            <NumInputWithMotion min='0.001' max='1.00' step='0.00001' onChange={(e) => setConfig({ ...config, deltaT: parseFloat(e.target.value) })} value={config.deltaT} />
            <OptionResetButton handler={() => setConfig({ ...config, deltaT: INIT_VARS.deltaT })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Start Var: </OptionTitle>
            <OptionValue>{config.startVal}</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, startVal: parseInt(e.target.value) })} value={config.startVal} />
            <NumInputWithMotion min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, startVal: parseInt(e.target.value) })} value={config.startVal} />
            <OptionResetButton handler={() => setConfig({ ...config, startVal: INIT_VARS.startVal })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>End Var: </OptionTitle>
            <OptionValue>{config.endVal}</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, endVal: parseInt(e.target.value) })} value={config.endVal} />
            <NumInputWithMotion min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, endVal: parseInt(e.target.value) })} value={config.endVal} />
            <OptionResetButton handler={() => setConfig({ ...config, endVal: INIT_VARS.endVal })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Freq: </OptionTitle>
            <OptionValue>{config.freq}</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, freq: parseFloat(e.target.value) })} value={config.freq} />
            <NumInputWithMotion min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, freq: parseFloat(e.target.value) })} value={config.freq} />
            <OptionResetButton handler={() => setConfig({ ...config, freq: INIT_VARS.freq })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Decay: </OptionTitle>
            <OptionValue>{config.decay}</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, decay: parseFloat(e.target.value) })} value={config.decay} />
            <NumInputWithMotion min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, decay: parseFloat(e.target.value) })} value={config.decay} />
            <OptionResetButton handler={() => setConfig({ ...config, decay: INIT_VARS.decay })} />
          </RangeAndReset>
        </OptionContainer>
        <OptionContainer>
          <OptionTitleAndValueContainer>
            <OptionTitle>Reduce Rate: </OptionTitle>
            <OptionValue>{config.reduceRate}</OptionValue>
          </OptionTitleAndValueContainer>
          <RangeAndReset>
            <Range type='range' min='0.0' max='10' step='0.001' onChange={(e) => setConfig({ ...config, reduceRate: parseFloat(e.target.value) })} value={config.reduceRate} />
            <NumInputWithMotion min='0.0' max='10' step='0.001' onChange={(e) => setConfig({ ...config, reduceRate: parseFloat(e.target.value) })} value={config.reduceRate} />
            <OptionResetButton handler={() => setConfig({ ...config, reduceRate: INIT_VARS.reduceRate })} />
          </RangeAndReset>
        </OptionContainer>
      </OptionsContainer>
      <BigResetButtonWithMotion handler={() => setConfig(INIT_VARS)}>Reset All!</BigResetButtonWithMotion>
    </Container>
  )
}
// bg-gradient-to-r from-0% from-pink-500 ${makePercentage("from", config.endTime, config.inPoint)} via-neutral-700 ${makePercentage("via", config.endTime, config.inPoint)} to-neutral-700

