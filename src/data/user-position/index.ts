import { convertPositionsToDistance } from '../../tools/convert';
import { getSettingOptionValue } from '../settings/index';

interface position {
  latitude: number;
  longitude: number;
}

const userPosition = {
  current: {
    latitude: 0,
    longitude: 0
  },
  permission: {
    gained: false,
    asked: false
  },
  id: 0
};

export function askForPositioningPermission(): void {
  function successHandler(position: any): void {
    userPosition.permission.gained = true;
    userPosition.current.latitude = position.coords.latitude;
    userPosition.current.longitude = position.coords.longitude;
  }
  function errorHandler(error: any): void {
    var message = '';
    // Check for known errors
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'This website does not have permission to use the Geolocation API';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'The current position could not be determined.';
        break;
      case error.PERMISSION_DENIED_TIMEOUT:
        message = 'The current position could not be determined ' + 'within the specified timeout period.';
        break;
    }
    if (message == '') {
      var strErrorCode = error.code.toString();
      message = 'The position could not be determined due to ' + 'an unknown error (Code: ' + strErrorCode + ').';
    }
    console.log(message);
  }
  if (userPosition.permission.asked === false && getSettingOptionValue('display_user_location')) {
    userPosition.permission.asked = true;
    userPosition.id = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });
  }
}

export function getUserPosition(): position {
  if (userPosition.permission.asked && userPosition.permission.gained) {
    return userPosition.current;
  }
  if (!userPosition.permission.asked && !userPosition.permission.gained) {
    askForPositioningPermission();
    return userPosition.current;
  }
  if (userPosition.permission.asked && !userPosition.permission.gained) {
    return userPosition.current;
  }
}

export function isNearUserPosition(latitude: number, longitude: number, radius: number = 450): boolean {
  var currentUserPosition: position = getUserPosition();
  var distance: number = convertPositionsToDistance(latitude, longitude, currentUserPosition.latitude, currentUserPosition.longitude);
  if (distance <= radius) {
    return true;
  } else {
    return false;
  }
}

export function getNearestPosition(positions: Array<position>, radius: number = 450): position | null {
  var currentUserPosition: position = getUserPosition();
  var result = [];
  for (var position of positions) {
    var distance: number = convertPositionsToDistance(currentUserPosition.latitude, currentUserPosition.longitude, position.latitude, position.longitude);
    if (distance <= radius) {
      result.push({ position, distance });
    }
  }

  if (result.length > 0) {
    result = result.sort(function (a, b) {
      return a.distance - b.distance;
    });
    return result[0].position;
  } else {
    return null;
  }
}
