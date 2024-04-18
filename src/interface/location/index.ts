import { integrateLocation } from '../../data/apis/index.ts';
import { compareThings, getTextWidth, calculateStandardDeviation, md5 } from '../../tools/index.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';

var previousIntegration: object = {};

var locationRefreshTimer: object = {
  defaultInterval: 15 * 1000,
  minInterval: 5 * 1000,
  dynamicInterval: 15 * 1000,
  auto: true,
  streaming: false,
  lastUpdate: 0,
  nextUpdate: 0,
  refreshing: false,
  currentRequestID: '',
  streamStarted: false
};

var currentHashSet: object = {
  hash: ''
};

function setUpLocationFieldSkeletonScreen(Field: HTMLElement): void {
  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { g_0: Math.floor(FieldHeight / 50) + 5, g_1: Math.floor(FieldHeight / 50) + 5 };
  var defaultGroupQuantity = 2;
  var groupedItems = {};
  for (var i = 0; i < defaultGroupQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    for (var j = 0; j < defaultItemQuantity[groupKey]; j++) {
      groupedItems[groupKey].push({
        name: '',
        status: { code: -1, text: '' },
        buses: null,
        overlappingRoutes: null,
        sequence: j,
        location: {
          latitude: null,
          longitude: null
        },
        segmentBuffer: {
          endpoint: false,
          type: null
        },
        id: null
      });
    }
  }
  updateLocationField(
    Field,
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      itemQuantity: defaultItemQuantity,
      RouteName: '載入中',
      RouteEndPoints: {
        RouteDeparture: '載入中',
        RouteDestination: '載入中'
      },
      RouteID: null,
      PathAttributeId: []
    },
    true
  );
}

function updateLocationField(Field: HTMLElement, Location: object, skeletonScreen: boolean): void {}

async function refreshLocation(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  locationRefreshTimer.auto = refresh_interval_setting.auto;
  locationRefreshTimer.defaultInterval = refresh_interval_setting.defaultInterval;
  locationRefreshTimer.refreshing = true;
  locationRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  //document.querySelector('.update_timer').setAttribute('refreshing', true);

  var integration = await integrateLocation(currentHashSet.hash, locationRefreshTimer.currentRequestID);
  var Field = document.querySelector('.location_field');
  updateLocationField(Field, integration, false);
  locationRefreshTimer.lastUpdate = new Date().getTime();
  if (locationRefreshTimer.auto) {
    var updateRate = await getUpdateRate();
    locationRefreshTimer.nextUpdate = Math.max(new Date().getTime() + locationRefreshTimer.minInterval, integration.dataUpdateTime + locationRefreshTimer.defaultInterval / updateRate);
  } else {
    locationRefreshTimer.nextUpdate = new Date().getTime() + locationRefreshTimer.defaultInterval;
  }
  locationRefreshTimer.dynamicInterval = Math.max(locationRefreshTimer.minInterval, locationRefreshTimer.nextUpdate - new Date().getTime());
  locationRefreshTimer.refreshing = false;
  //document.querySelector('.update_timer').setAttribute('refreshing', false);
  return { status: 'Successfully refreshed the location.' };
}

export function streamLocation(): void {
  refreshLocation()
    .then((result) => {
      if (locationRefreshTimer.streaming) {
        locationRefreshTimer.timer = setTimeout(function () {
          streamLocation();
        }, Math.max(locationRefreshTimer.minInterval, locationRefreshTimer.nextUpdate - new Date().getTime()));
      } else {
        locationRefreshTimer.streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (locationRefreshTimer.streaming) {
        locationRefreshTimer.timer = setTimeout(function () {
          streamLocation();
        }, locationRefreshTimer.minInterval);
      } else {
        locationRefreshTimer.streamStarted = false;
      }
    });
}

export function openLocation(hash: string): void {
  currentHashSet.hash = hash;
  var Field = document.querySelector('.location_field');
  Field.setAttribute('displayed', 'true');
  setUpLocationFieldSkeletonScreen(Field);
  if (!locationRefreshTimer.streaming) {
    locationRefreshTimer.streaming = true;
    if (!locationRefreshTimer.streamStarted) {
      locationRefreshTimer.streamStarted = true;
      streamLocation();
    } else {
      refreshLocation();
    }
    //updateUpdateTimer();
  }
}

export function closeLocation() {
  var Field = document.querySelector('.location_field');
  Field.setAttribute('displayed', 'false');
  locationRefreshTimer.streaming = false;
}
