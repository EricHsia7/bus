export function timeStampToNumber(string: string): number {
  var regex = /[0-9\.]*/gm;
  var match = string.match(regex);
  if (match) {
    var year = parseInt(match[0]);
    var month = parseInt(match[2]);
    var date = parseInt(match[4]);
    var hours = parseInt(match[6]);
    var minutes = parseInt(match[8]);
    var seconds = parseInt(match[10]);
    var date_object = new Date();
    date_object.setDate(1);
    date_object.setMonth(0);
    date_object.setFullYear(year);
    date_object.setMonth(month - 1);
    date_object.setDate(date);
    date_object.setHours(hours);
    date_object.setMinutes(minutes);
    date_object.setSeconds(seconds);
    return date_object.getTime();
  }
  return 0;
}

export function dateToString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatTime(time: number, mode: number): string {
  if (mode === 0) {
    return `${time}秒`;
  }
  if (mode === 1) {
    var minutes = String((time - (time % 60)) / 60);
    var seconds = String(time % 60);
    return [minutes, seconds].map((u) => u.padStart(2, '0')).join(':');
  }
  if (mode === 2) {
    var minutes = String(Math.floor(time / 60));
    return `${minutes}分`;
  }
  if (mode === 3) {
    if (time >= 60) {
      var minutes = String(Math.floor(time / 60));
      return `${minutes}分`;
    } else {
      return `${time}秒`;
    }
  }
  return '--';
}

export function formatEstimateTime(EstimateTime: string, mode: number): object {
  var time = parseInt(EstimateTime);
  if (time === -3) {
    return { code: 6, text: '末班駛離' };
  }
  if (time === -4) {
    return { code: 5, text: '今日停駛' };
  }
  if (time === -2) {
    return { code: 4, text: '交通管制' };
  }
  if (time === -1) {
    return { code: 3, text: '未發車' };
  }

  if (0 <= time && time <= 10) {
    return { code: 2, text: '進站中' };
  }

  if (10 < time && time <= 90) {
    return { code: 2, text: formatTime(time, mode) };
  }
  if (90 < time && time <= 180) {
    return { code: 1, text: formatTime(time, mode) };
  }
  if (180 < time && time <= 250) {
    return { code: 0.5, text: formatTime(time, mode) };
  }
  if (250 < time) {
    return { code: 0, text: formatTime(time, mode) };
  }
}

export function formatTimeCode(code: string, mode: number): object {
  if (mode === 0) {
    var hours = 0;
    var minutes = 0;
    if (code.length === 4) {
      hours = parseInt(code.substring(0, 2));
      minutes = parseInt(code.substring(2, 4));
    }
    if (code.length === 2) {
      minutes = parseInt(code);
    }
    return {
      type: 'moment',
      hours: hours,
      minutes: minutes
    };
  } else {
    if (mode === 1) {
      var min = 0;
      var max = 0;
      if (code.length === 4) {
        var number1 = parseInt(code.substring(0, 2));
        var number2 = parseInt(code.substring(2, 4));
        min = Math.min(number1, number2);
        max = Math.max(number1, number2);
      }
      if (code.length === 2) {
        var number = parseInt(code);
        min = number;
        max = number;
      }
      return {
        type: 'range',
        min: min,
        max: max
      };
    }
  }
}

export function indexToDay(index: number): object {
  var days = [
    {
      name: '週六',
      day: 0,
      code: 'sat'
    },
    {
      name: '週一',
      day: 1,
      code: 'mon'
    },
    {
      name: '週二',
      day: 2,
      code: 'tue'
    },
    {
      name: '週三',
      day: 3,
      code: 'wed'
    },
    {
      name: '週四',
      day: 4,
      code: 'thu'
    },
    {
      name: '週五',
      day: 5,
      code: 'fri'
    },
    {
      name: '週日',
      day: 6,
      code: 'sun'
    }
  ];
}

export function dateValueToDayOfWeek(dateValue: string): object {
  var index = 0;
  var int = parseInt(dateValue);
  if (int === 1) {
    index = 6;
  }
  if (2 <= int && int <= 6) {
    index = int - 1;
  }
  if (int === 7) {
    index = 0;
  }
  return indexToDay(index);
}
