import puppeteer, { Page, ConsoleMessage } from 'puppeteer';
import * as stats from 'stats-lite';

const getMetricByName = (log: string, metric: string) => {
  if (log.includes(metric)) {
    return parseFloat(log.replace(metric, ''));
  }
  return undefined;
};

const step = async (
  page: Page,
  flags: {
    useFake?: boolean;
    disableIframe?: boolean;
    usePreloadAndDelayedRelated?: boolean;
    useDelayedApp?: boolean;
    useChunkedRendering?: boolean;
  }
) => {
  const logs: Partial<Record<'related' | 'player', number>> = {};

  const promise = new Promise<void>((resolve, reject) => {
    const handleLogs = (msg: ConsoleMessage) => {
      const text = msg.text();
      const relatedMetric = getMetricByName(
        text,
        'Metrics:  Related first render'
      );
      if (relatedMetric !== undefined) {
        logs.related = relatedMetric;
      }
      const playerMetric = getMetricByName(text, 'Metrics:  First start');
      if (playerMetric !== undefined) {
        logs.player = playerMetric;
      }
      if (Object.keys(logs).length === 2) {
        unsubscribe();
        resolve();
      }
    };
    const timer = setTimeout(() => {
      unsubscribe();
      reject();
    }, 100 * 1e3);
    const unsubscribe = () => {
      page.off('console', handleLogs);
      clearTimeout(timer);
    };

    page.on('console', handleLogs);
  });

  const flagsStr = Object.entries(flags)
    .map(([flag, value]) => `${flag}=${value ? 1 : 0}`)
    .join('&');

  await page.goto(
    `http://localhost:4200/watch/0?${flagsStr}`
  );

  await promise;

  return logs as Required<typeof logs>;
};

const launchesFlags = [
  {
    useFake: true,
    disableIframe: true,
  },
  {
    useFake: true,
    disableIframe: true,
    usePreloadAndDelayedRelated: true,
  },
  {
    useFake: true,
    disableIframe: true,
    usePreloadAndDelayedRelated: true,
    useDelayedApp: true,
  },
  {
    useFake: true,
    disableIframe: true,
    usePreloadAndDelayedRelated: true,
    useDelayedApp: true,
    useChunkedRendering: true,
  },
];
const control = Number(process.env.CONTROL || 0);
const test = Number(process.env.TEST || 1);
const iterations = Number(process.env.ITERATIONS || 50);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const controlMetrics: Awaited<ReturnType<typeof step>>[] = [];
  const testMetrics: Awaited<ReturnType<typeof step>>[] = [];
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setDefaultNavigationTimeout(100 * 1e3);
  await page.emulateCPUThrottling(2);
  await page.emulateNetworkConditions({
    download: (10 * 1024 * 1024) / 8,
    upload: (10 * 1024 * 1024) / 8,
    latency: 20,
  });
  await page.setViewport({ width: 1792, height: 1120 });
  for (let i = 0; i < iterations; i++) {
    console.log('Running control step');
    const logs = await step(page, launchesFlags[control]);
    controlMetrics.push(logs);
    console.log('End control step with logs', logs);
  }
  for (let i = 0; i < iterations; i++) {
    console.log('Running test step');
    const logs = await step(page, launchesFlags[test]);
    testMetrics.push(logs);
    console.log('End test step with logs', logs);
  }
  await browser.close();

  const controlRelated = controlMetrics.map((m) => m.related / 1000);
  const controlPlayer = controlMetrics.map((m) => m.player / 1000);
  const testRelated = testMetrics.map((m) => m.related / 1000);
  const testPlayer = testMetrics.map((m) => m.player / 1000);
  console.log(
    `Metrics. Control flags`,
    launchesFlags[control],
    `Test flags`,
    launchesFlags[test]
  );

  const prepareMetrics = (
    getMetric: (arr: number[]) => number,
    isPlayer: boolean,
    withDiff = true,
    precision = 1
  ) => {
    const control = getMetric(isPlayer ? controlPlayer : controlRelated);
    const test = getMetric(isPlayer ? testPlayer : testRelated);
    return {
      'control, s': parseFloat(control.toFixed(precision)),
      'test, s': parseFloat(test.toFixed(precision)),
      'diff, s': withDiff
        ? parseFloat((test - control).toFixed(precision))
        : '-',
      'diff, %': withDiff
        ? parseFloat(((100 * (test - control)) / control).toFixed(precision))
        : '-',
    };
  };

  console.table({
    'Mean player:': prepareMetrics(stats.mean, true),
    'Median player:': prepareMetrics(stats.median, true),
    '90 percentile player:': prepareMetrics(
      (arr) => stats.percentile(arr, 0.9),
      true
    ),
    'Standard deviation player:': prepareMetrics(stats.stdev, true, false),

    'Mean related:': prepareMetrics(stats.mean, false),
    'Median related:': prepareMetrics(stats.median, false),
    '90 percentile related:': prepareMetrics(
      (arr) => stats.percentile(arr, 0.9),
      false
    ),
    'Standard deviation related:': prepareMetrics(stats.stdev, false, false),
  });
})();
