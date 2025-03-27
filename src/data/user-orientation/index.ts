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
  if (userOrientation.permission.asked === false && getSettingOptionValue('display_user_orientation')) {
    userOrientation.permission.asked = true;
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            // Permission granted, start listening to the event
            if ('ondeviceorientationabsolute' in window) {
              window.addEventListener(
                'deviceorientationabsolute',
                function (event: DeviceOrientationEvent) {
                  userOrientation.current = event?.alpha || -1;
                },
                true
              );
            } else {
              if ('ondeviceorientation' in window) {
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
              }
            }
          } else {
            console.error('Permission not granted for DeviceOrientation');
          }
        })
        .catch((err) => {
          console.error('Error requesting DeviceOrientation permission:', err);
        });
    } else {
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
