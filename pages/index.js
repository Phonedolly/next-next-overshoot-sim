import Head from 'next/head'
import Image from 'next/image'
import { Outfit } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import React from 'react'
import { useEffect } from 'react'

const outfit = Outfit({ subsets: ['latin'] })

const REDUCE_RATE = 1;
const X_AMPLIFY_FACTOR = 600;
const DIFF_X = 0.53;
const MAX_END_TIME = 5.00;
const INIT_VARS = {
  endTime: 5.00,
  deltaT: 0.001,
  dur: 0.01,
  inPoint: 1.00,
  startVar: 450,
  endVar: 545,
  freq: 7,
  decay: 3,
  reduceRate: 1
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

//text-white font-bold text-md w-32 bg-neutral-700 py-3 px-4 rounded-full
const Button = styled(motion.button)`
  color: white;
  font-weight: bold;
  font-size: 1rem;
  /* width: 8em;
  height:  */
  background-color: #404040;
  padding: 1em 1.5em;
  border: none;
  border-radius: 30px;
  cursor: pointer;
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
const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3em;
  width: 100%;
  max-width: 90vw;
  @media (min-width: 1280px) {
    max-width: 80vw;
  }
  align-items: center;
`;

const EachOptionContainer = styled.div`
    display: flex;
    flex-direction: column;
  `;


const EachOptionTitleAndValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.5em;
`;

const EachOptionTitle = styled.p`
   font-size: 1.2em;
   font-weight: bold;
   color: white;
`;

const EachOptionValue = styled.p`
   font-size: 1.0em;
   color: whitesmoke;
`;

const EachOptionResetButton = styled(ResetButton)`
  align-items: center;
  justify-content: center;
`;


const BigResetButton = styled(ResetButton)`
  align-items: center;
  justify-content: center;
  font-size: 2.3em;
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

export default function Home() {
  const [config, setConfig] = React.useState(INIT_VARS);
  const [graph, setGraph] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);


  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function RunButton(props) {
    return (
      <motion.button
        className='text-white font-bold text-2xl w-48 bg-neutral-700 py-3 px-4 rounded-full'
        whileHover={{ scale: 1.1, transition: { duration: 0.25, } }} whileTap={{ scale: 1.00, transition: { duration: 0.05, ease: 'linear' } }} onClick={() => setConfig({ ...config, ...INIT_VARS })}
      >Reset All!</motion.button>
    )
  }

  useEffect(() => {
    function drawGraph() {
      const { endTime, deltaT, dur, inPoint, startVar, endVar, freq, decay, reduceRate } = config;
      let howToMove = [];
      let time = 0.00;

      let t = time - inPoint;
      /* draw at t < dur */
      for (; t <= dur; time += deltaT, t = time - inPoint) {
        const progress = (time / dur);
        howToMove.push([time * DIFF_X * X_AMPLIFY_FACTOR, (1200 - (easeInOutSine(progress) * (endVar - startVar)) + startVar) * config.reduceRate])
      }

      /* draw at time <=3.0 */
      for (; time <= endTime; time += deltaT, t = time - inPoint) {
        const amp = ((endVar - startVar) / dur);
        const w = freq * Math.PI
        const dst = -((endVar) + amp * (Math.sin((t - dur) * w) / Math.exp(decay * (t - dur)) / w)) * config.reduceRate;
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
        <motion.svg className='p-1' viewBox={`150 ${-endVar * 2} 1600 ${1200 * REDUCE_RATE * REDUCE_RATE}`} fill='transparent'>
          <path d={pathStr} stroke='white' strokeWidth="10"></path>
        </motion.svg>
      return graph
    }
    // console.log(1)
    setGraph(drawGraph());
  }, [refreshKey, config])
  return (
    <Container className={`${outfit.className}`} >
      <Title>After Effect Overshoot Expression Simulator</Title>
      {graph}
      <OptionsContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>End time: </EachOptionTitle>
            <EachOptionValue>{config.endTime}s</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, endTime: 5.00 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, endTime: parseFloat(e.target.value) })} value={config.endTime} endTime={config.endTime} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>inPoint: </EachOptionTitle>
            <EachOptionValue>{config.inPoint}s</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, inPoint: 1.00 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, inPoint: parseFloat(e.target.value) })} value={config.inPoint} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Duration: </EachOptionTitle>
            <EachOptionValue>{config.dur}s</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, dur: 5.00 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.00' max='5.00' step='0.0001' onChange={(e) => setConfig({ ...config, dur: parseFloat(e.target.value) })} value={config.dur} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Delta T: </EachOptionTitle>
            <EachOptionValue>{config.deltaT}s</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, deltaT: 0.001 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.001' max='1.00' step='0.00001' onChange={(e) => setConfig({ ...config, deltaT: parseFloat(e.target.value) })} value={config.deltaT} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Start Var: </EachOptionTitle>
            <EachOptionValue>{config.startVar}</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, startVar: 0 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, startVar: parseInt(e.target.value) })} value={config.startVar} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>End Var: </EachOptionTitle>
            <EachOptionValue>{config.endVar}</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, endVar: 1000 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0' max='1000' step='1' onChange={(e) => setConfig({ ...config, endVar: parseInt(e.target.value) })} value={config.endVar} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Freq: </EachOptionTitle>
            <EachOptionValue>{config.freq}</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, freq: 0.01 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, freq: parseFloat(e.target.value) })} value={config.freq} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Decay: </EachOptionTitle>
            <EachOptionValue>{config.decay}</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, decay: 0.01 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.0' max='100' step='0.001' onChange={(e) => setConfig({ ...config, decay: parseFloat(e.target.value) })} value={config.decay} />
        </EachOptionContainer>
        <EachOptionContainer>
          <EachOptionTitleAndValueContainer>
            <EachOptionTitle>Reduce Rate: </EachOptionTitle>
            <EachOptionValue>{config.reduceRate}</EachOptionValue>
            <EachOptionResetButton handler={() => setConfig({ ...config, reduceRate: 1 })} />
          </EachOptionTitleAndValueContainer>
          <Range type='range' min='0.0' max='10' step='0.001' onChange={(e) => setConfig({ ...config, reduceRate: parseFloat(e.target.value) })} value={config.reduceRate} />
        </EachOptionContainer>
      </OptionsContainer>
      <BigResetButton handler={() => setConfig(INIT_VARS)}>Reset All!</BigResetButton>
    </Container>
  )
}
// bg-gradient-to-r from-0% from-pink-500 ${makePercentage("from", config.endTime, config.inPoint)} via-neutral-700 ${makePercentage("via", config.endTime, config.inPoint)} to-neutral-700

