import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import ProductPage from './ProductPage';

const CAT3_PLD_SBW_PRODUCTS = [
  {
    name: 'Display module - IQAN-MD5',
    image: './images/display-module-iqan-md5.png',
    description:
      'The IQAN-MD5 is a high-performance display module designed for mobile machinery, offering intuitive HMI capabilities with a responsive multi-touch screen.',
  },
  {
    name: 'Master controllers - IQAN-MC41',
    image: './images/master-controllers-iqan-mc41.png',
    description:
      'IQAN-MC41 master controllers provide flexible I/O configurations and powerful processing for advanced machine control applications.',
  },
  {
    name: 'Rotary Position Sensor - RS',
    image: './images/rotary-position-sensor-rs.png',
    description:
      'Rotary Position Sensors are Hall Effect devices with an output voltage dependent upon the angular position of the sensor. They utilize non-contacting technology and are offered in several linear ranges up to 360 degrees of rotation.',
  },
  {
    name: 'Force Feedback Device (FFD)',
    image: './images/force-feedback-device-ffd.png',
    description:
      'Force Feedback Devices provide precise haptic feedback for steer-by-wire systems, enabling operators to feel road conditions through the steering input.',
  },
  {
    name: 'Hydraulic Cylinders - Heavy Duty Roundline Welded \u2013 Series RDH',
    image: './images/hydraulic-cylinders-rdh.png',
    description:
      'Heavy Duty Roundline Welded cylinders in the RDH series deliver reliable hydraulic actuation for demanding mobile equipment applications.',
  },
  {
    name: 'Mobile Directional Control Valve, SBW110',
    image: './images/directional-control-valve-sbw110.png',
    description:
      'The SBW110 mobile directional control valve is specifically designed for steer-by-wire applications, providing precise flow control and system integration.',
  },
];

const CAT2_PLD_SBW_PRODUCTS = [
  {
    name: 'Display module - IQAN-MD5',
    image: './images/display-module-iqan-md5.png',
    description:
      'The IQAN-MD5 is a high-performance display module designed for mobile machinery, offering intuitive HMI capabilities with a responsive multi-touch screen.',
  },
  {
    name: 'Master controllers - IQAN-MC41',
    image: './images/master-controllers-iqan-mc41.png',
    description:
      'IQAN-MC41 master controllers provide flexible I/O configurations and powerful processing for advanced machine control applications.',
  },
  {
    name: 'Rotary Position Sensor - RS',
    image: './images/rotary-position-sensor-rs.png',
    description:
      'Rotary Position Sensors are Hall Effect devices with an output voltage dependent upon the angular position of the sensor. They utilize non-contacting technology and are offered in several linear ranges up to 360 degrees of rotation.',
  },
  {
    name: 'Force Feedback Device (FFD)',
    image: './images/force-feedback-device-ffd.png',
    description:
      'Force Feedback Devices provide precise haptic feedback for steer-by-wire systems, enabling operators to feel road conditions through the steering input.',
  },
  {
    name: 'Hydraulic Cylinders - Heavy Duty Roundline Welded \u2013 Series RDH',
    image: './images/hydraulic-cylinders-rdh.png',
    description:
      'Heavy Duty Roundline Welded cylinders in the RDH series deliver reliable hydraulic actuation for demanding mobile equipment applications.',
  },
  {
    name: 'Mobile Directional Control Valve, SBW110',
    image: './images/directional-control-valve-sbw110.png',
    description:
      'The SBW110 mobile directional control valve is specifically designed for steer-by-wire applications, providing precise flow control and system integration.',
  },
];

const CATB_SBW_PRODUCTS = [
  {
    name: 'Display module - IQAN-MD5',
    image: './images/display-module-iqan-md5.png',
    description:
      'The IQAN-MD5 is a high-performance display module designed for mobile machinery, offering intuitive HMI capabilities with a responsive multi-touch screen.',
  },
  {
    name: 'Master controllers - IQAN-MC41',
    image: './images/master-controllers-iqan-mc41.png',
    description:
      'IQAN-MC41 master controllers provide flexible I/O configurations and powerful processing for advanced machine control applications.',
  },
  {
    name: 'Rotary Position Sensor - RS',
    image: './images/rotary-position-sensor-rs.png',
    description:
      'Rotary Position Sensors are Hall Effect devices with an output voltage dependent upon the angular position of the sensor. They utilize non-contacting technology and are offered in several linear ranges up to 360 degrees of rotation.',
  },
  {
    name: 'Force Feedback Device (FFD)',
    image: './images/force-feedback-device-ffd.png',
    description:
      'Force Feedback Devices provide precise haptic feedback for steer-by-wire systems, enabling operators to feel road conditions through the steering input.',
  },
  {
    name: 'Hydraulic Cylinders - Heavy Duty Roundline Welded \u2013 Series RDH',
    image: './images/hydraulic-cylinders-rdh.png',
    description:
      'Heavy Duty Roundline Welded cylinders in the RDH series deliver reliable hydraulic actuation for demanding mobile equipment applications.',
  },
  {
    name: 'Mobile Directional Control Valve, SBW110',
    image: './images/directional-control-valve-sbw110.png',
    description:
      'The SBW110 mobile directional control valve is specifically designed for steer-by-wire applications, providing precise flow control and system integration.',
  },
];

const CAT3_PLD_BBW_PRODUCTS = [
  {
    name: 'Display module - IQAN-MD5',
    image: './images/display-module-iqan-md5.png',
    description:
      'The IQAN-MD5 is a high-performance display module designed for mobile machinery, offering intuitive HMI capabilities with a responsive multi-touch screen.',
  },
  {
    name: 'Master controllers - IQAN-MC41',
    image: './images/master-controllers-iqan-mc41.png',
    description:
      'IQAN-MC41 master controllers provide flexible I/O configurations and powerful processing for advanced machine control applications.',
  },
  {
    name: 'Rotary Position Sensor - RS',
    image: './images/rotary-position-sensor-rs.png',
    description:
      'Rotary Position Sensors are Hall Effect devices with an output voltage dependent upon the angular position of the sensor. They utilize non-contacting technology and are offered in several linear ranges up to 360 degrees of rotation.',
  },
  {
    name: 'Force Feedback Device (FFD)',
    image: './images/force-feedback-device-ffd.png',
    description:
      'Force Feedback Devices provide precise haptic feedback for steer-by-wire systems, enabling operators to feel road conditions through the steering input.',
  },
  {
    name: 'Hydraulic Cylinders - Heavy Duty Roundline Welded \u2013 Series RDH',
    image: './images/hydraulic-cylinders-rdh.png',
    description:
      'Heavy Duty Roundline Welded cylinders in the RDH series deliver reliable hydraulic actuation for demanding mobile equipment applications.',
  },
  {
    name: 'Mobile Directional Control Valve, SBW110',
    image: './images/directional-control-valve-sbw110.png',
    description:
      'The SBW110 mobile directional control valve is specifically designed for steer-by-wire applications, providing precise flow control and system integration.',
  },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/cat3-pld-sbw"
        element={
          <ProductPage
            categoryLabel="Category 3, PLd Steer by Wire System"
            products={CAT3_PLD_SBW_PRODUCTS}
          />
        }
      />
      <Route
        path="/cat2-pld-sbw"
        element={
          <ProductPage
            categoryLabel="Category 2, PLd Steer by Wire System"
            products={CAT2_PLD_SBW_PRODUCTS}
          />
        }
      />
      <Route
        path="/catb-sbw"
        element={
          <ProductPage
            categoryLabel="Category B, Steer by Wire System"
            products={CATB_SBW_PRODUCTS}
          />
        }
      />
      <Route
        path="/cat3-pld-bbw"
        element={
          <ProductPage
            categoryLabel="Category 3, PLd Brake By Wire System"
            products={CAT3_PLD_BBW_PRODUCTS}
          />
        }
      />
    </Routes>
  );
}

