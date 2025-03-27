import { CardinalDirection, getCardinalDirectionFromVector, UnknownCardinalDirection } from '../../tools/cardinal-direction';
import { getSettingOptionValue } from '../settings/index';

interface Orientation {
  degree: number;
  cardinalDirection: CardinalDirection;
}

const userOrientation = {
  current: -1,
  permission: {
    gained: false,
    asked: false
  },
  id: 0
};

export function askForCalibratingPermission(): void {
  console.log(0);
  if (userOrientation.permission.asked === false && getSettingOptionValue('display_user_orientation')) {
    console.log(1);
    userOrientation.permission.asked = true;
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      console.log(2);
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          console.log(3, permissionState);
          if (permissionState === 'granted') {
            console.log(4);
            // Permission granted, start listening to the event
            window.addEventListener(
              'deviceorientation',
              function (event: DeviceOrientationEvent) {
                if (event.absolute) {
                  userOrientation.current = event?.alpha || -1;
                } else {
                  if (event.webkitCompassHeading) {
                    userOrientation.current = event.webkitCompassHeading || -1;
                  } else {
                    userOrientation.current = event?.alpha || -1;
                  }
                }
              },
              true
            );
          } else {
            console.log(5);
            console.error('Permission not granted for DeviceOrientation');
          }
        })
        .catch((err) => {
          console.log(6);
          console.error('Error requesting DeviceOrientation permission:', err);
        });
    } else {
      console.log(7);
      console.log(`DeviceOrientation isn't supported.`);
    }
  }
}

export function getUserOrientation(): Orientation {
  const alpha = userOrientation.current;
  if (alpha === -1) {
    return {
      degree: -1,
      cardinalDirection: UnknownCardinalDirection
    };
  } else {
    let angle: number = alpha + 90;
    if (angle > 360) {
      angle -= 360;
    }
    angle *= Math.PI / 180;
    const vector = [Math.cos(angle), Math.sin(angle)];
    const cardinalDirection = getCardinalDirectionFromVector(vector);
    return {
      degree: alpha,
      cardinalDirection: cardinalDirection
    };
  }
}
