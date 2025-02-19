let taskQueue = [];

let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [personalSchedules, busArrivalTimes, taskID] = event.data;
      taskQueue.push({ personalSchedules, busArrivalTimes, taskID, port });
      drawBusArrivalTimeGraphContent_worker();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [personalSchedules, busArrivalTimes, taskID] = event.data;
    taskQueue.push({ personalSchedules, busArrivalTimes, taskID, port });
    drawBusArrivalTimeGraphContent_worker();
  };
}

function drawBusArrivalTimeGraphContent_worker(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { personalSchedules, busArrivalTimes, taskID, port } = taskQueue.shift();

  let result = {};

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  drawBusArrivalTimeGraphContent_worker(); // Process next task in queue, if any
}
