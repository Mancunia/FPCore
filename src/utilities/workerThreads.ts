import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

class ThreadPool {
  private poolSize: number;
  private workers: Worker[] = [];
  private taskQueue: (() => void)[] = [];
  private workerStatus: Map<Worker, boolean> = new Map();

  constructor(poolSize: number) {
    this.poolSize = poolSize;
    this.initializePool();
  }

  private initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(__filename);
      this.workers.push(worker);
      this.workerStatus.set(worker, false);

      worker.on('message', () => {
        console.log('Worker thread received message');
        this.processQueue();
      });
    }
  }

  public submitTask(task:any) {
    this.taskQueue.push(task);
    this.processQueue();
  }

  private processQueue() {
    const availableWorker = this.workers.find((worker) => !this.workerStatus.get(worker));

    if (availableWorker && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      this.workerStatus.set(availableWorker, true);

      availableWorker.postMessage({
        type: 'executeTask',
        task,
      });
    }
  }
}


// interface WorkerMessage {
//   type: string;
//   task?: () => void;
// }

// if (!isMainThread) {
//   // This code is executed in the Worker thread

//   parentPort.on('message', (message: WorkerMessage) => {
//     if (message.type === 'executeTask') {
//       const { task } = message;

//       // Execute the task
//       try {
//         task?.();
//         parentPort.postMessage('TaskExecuted');
//       } catch (error) {
//         console.error('Error in task execution:', error);
//         parentPort.postMessage(`TaskError: ${error.message}`);
//       } finally {
//         // Notify the main thread that the worker is no longer working
//         parentPort.postMessage('TaskCompleted');
//       }
//     }
//   });
  
// } else {
//   // This code is executed in the Main thread

//   // Create a thread pool with a specified pool size
//   const threadPool = new ThreadPool(4); // Adjust the pool size as needed

//   // Example tasks
//   const task1 = () => {
//     console.log('Executing task 1');
//     // Your task logic here
//   };

//   const task2 = () => {
//     console.log('Executing task 2');
//     // Your task logic here
//   };

//   // Submit tasks to the thread pool
//   threadPool.submitTask(task1);
//   threadPool.submitTask(task2);
// }

export default ThreadPool