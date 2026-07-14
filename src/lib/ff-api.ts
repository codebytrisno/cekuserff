// @ts-nocheck
const FreeFireAPI = require("@arbakti_store/freefire-api");

let apiInstance: any = null;
let loginPromise: Promise<void> | null = null;

async function getApi() {
  if (apiInstance?.session?.token) return apiInstance;

  if (!loginPromise) {
    loginPromise = (async () => {
      const api = new FreeFireAPI();
      await api.login();
      apiInstance = api;
    })().catch((err) => {
      loginPromise = null;
      throw err;
    });
  }

  await loginPromise;
  return apiInstance;
}

export async function getProfile(uid: string) {
  const api = await getApi();
  return api.getPlayerProfile(uid);
}

export async function getBRStats(uid: string) {
  const api = await getApi();
  const data = await api.getPlayerStats(uid, "br", "career");
  return {
    solo: data.solostats || data.soloStats || null,
    duo: data.duostats || data.duoStats || null,
    quad: data.quadstats || data.quadStats || null,
  };
}

export async function getCSStats(uid: string) {
  const api = await getApi();
  const data = await api.getPlayerStats(uid, "cs", "career");
  return data.csstats || data.csStats || null;
}
