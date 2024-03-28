export enum ProjectName {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit',
  EMULATOR_PIXEL_5 = 'Emulator Pixel 5',
  SIMULATOR_IPHONE_12 = 'Simulator iphone 12',
}

export function getIndexProjectByValue(value: string) {
  const indexOf = Object.values(ProjectName).indexOf(
    value as unknown as ProjectName,
  );
  return indexOf;
}
