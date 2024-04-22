import { getSettingOptionValue } from '../settings/index.ts';

interface position {
  latitude: number;
  longitude: number;
}

var user_position = {
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

export function askForPositioningPermission() {
  function successHandler(position: any): void {
    user_position.permission.gained = true;
    user_position.current.latitude = position.coords.latitude;
    user_position.current.longitude = position.coords.longitude;
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
  if (user_position.permission.asked === false && getSettingOptionValue('display_user_location')) {
    user_position.permission.asked = true;
    user_position.id = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });
  }
}

export function getUserPosition(): position {
  if (user_position.permission.asked && user_position.permission.gained) {
    return user_position.current;
  } else {
    return {
      longitude: 0,
      latitude: 0
    };
  }
}
