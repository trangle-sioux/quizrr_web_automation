import { readJsonFile } from '../../../utils/json/json.util';
import { environment as ENV } from '../../../utils/environment.util';
import { ciEquals, getRandomItemInList } from '../../../utils/string.util';
import { getMarketByName } from '../../../locales/dashboard/get-content';
import { MARKETS_DATA_TEST_PATH } from '../../../constants/path.constant';
import * as util from 'util';
import { getEnumEnvironment } from '../../../enums/environment.enum';
import { getUserAccountId } from '../user-info/users.data';
import { getAccountFactoryId } from '../accounts/account.data';
import { getFactoryMarketId } from '../factories/factory.data';

type Region = {
  name: {
    [key: string]: string;
  };
};

type MarketFragment = {
  $oid: string;
  name: string;
  regions?: Region[];
};

function getMarketDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(MARKETS_DATA_TEST_PATH, getEnumEnvironment(env));
}

const MARKETS_DATA = readJsonFile(getMarketDataPath());

export function getListNameOfMarkets() {
  let marketsData = MARKETS_DATA.filter(
    (market: any) => !['global', 'global-old'].includes(market.name),
  );

  let result: string[] = marketsData.map((obj: { name: string }) =>
    getMarketByName(obj.name),
  );
  return result;
}

export function getIndexOfOrderNameMarket(market: string) {
  const lstMarkets: string[] = getListNameOfMarkets();
  lstMarkets.sort((a: any, b: any) => a.localeCompare(b));
  return lstMarkets.indexOf(market);
}

function getMarketsWithRegion() {
  let mapMarketRegion = new Map<string, Region[]>();
  MARKETS_DATA.forEach(async (market: MarketFragment) => {
    if (market.regions !== undefined && market.regions.length != 0) {
      mapMarketRegion.set(getMarketByName(market.name), market.regions);
    }
  });
  return mapMarketRegion;
}

export function getRandomeMarketNameWithRegion() {
  let nameMarket: string = '';
  MARKETS_DATA.forEach(async (market: MarketFragment) => {
    if (nameMarket) {
      return;
    }
    if (market.regions !== undefined && market.regions.length != 0) {
      nameMarket = getMarketByName(market.name);
    }
  });
  return nameMarket;
}

export function getRandomMarketNameWithoutRegion() {
  let nameMarket: string = '';
  MARKETS_DATA.forEach((market: MarketFragment) => {
    if (nameMarket) {
      return;
    }
    if (market.regions === undefined || market.regions.length == 0) {
      nameMarket = getMarketByName(market.name);
    }
  });
  return nameMarket;
}

export function getRegionsOfMarket(nameMarket: string, languageTag?: string) {
  const lang: string = languageTag === undefined ? 'en' : languageTag;
  const mapData: Map<string, Region[]> = getMarketsWithRegion();
  let results: string[] = [];
  const regionWithMarket = mapData.get(nameMarket);
  if (regionWithMarket) {
    regionWithMarket.forEach((items: any) => {
      const regionName: string = items.name[lang];
      if (regionName) {
        results.push(items.name[lang]);
      }
    });
  }
  return results;
}

export function getRandomRegionOfMarket(
  nameMarket: string,
  languageTag?: string,
) {
  let regions: string[] = getRegionsOfMarket(nameMarket, languageTag);
  return getRandomItemInList(regions);
}

function getMarketNameById(marketId: string) {
  let marketsData = MARKETS_DATA.filter((market: any) =>
    ciEquals(marketId, market._id.$oid),
  );
  let result: string = getMarketByName(marketsData[0].name);
  return result;
}

export function getMarketNameByUserEmailAddress(email: string) {
  const accountId: string = getUserAccountId(email);
  const factoryId: string = getAccountFactoryId(accountId);
  const marketId: string = getFactoryMarketId(factoryId);
  return getMarketNameById(marketId);
}
