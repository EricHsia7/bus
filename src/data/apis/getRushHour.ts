export function getRushHour(region: number): [] {
  var rushHours = [
    [
      {
        start: {
          hours: 7,
          minutes: 0
        },
        end: {
          hours: 9,
          minutes: 0
        }
      },
      {
        start: {
          hours: 17,
          minutes: 0
        },
        end: {
          hours: 19,
          minutes: 30
        }
      }
    ]
  ];
  return rushHours[region];
}