const { db, admin } = require("../firebase");

async function calculateReading(readingId) {
  const readingRef = db.collection("meter_readings").doc(readingId);
  const snap = await readingRef.get();

  if (!snap.exists) throw new Error("Reading not found");

  const data = snap.data();

  if (data.calculationModeUsed !== "cloud") return;

  // settings
  const settingsSnap = await db
    .collection("app_settings")
    .doc("billing")
    .get();

  if (!settingsSnap.exists) throw new Error("Settings not found");

  const settings = settingsSnap.data();

  // last reading
  const prevSnap = await db
    .collection("meter_readings")
    .where("userId", "==", data.userId)
    .orderBy("timestamp", "desc")
    .limit(2)
    .get();

  let previousValue = data.meterValue;
  if (prevSnap.docs.length > 1) {
    previousValue = prevSnap.docs[1].data().meterValue;
  }

  const consumption = data.meterValue - previousValue;
  const cost =
    consumption > 0
      ? consumption * settings.pricePerKwh
      : settings.minMonthlyFee;

  await readingRef.update({
    previousValue,
    consumption,
    cost,
    pricePerKwhUsed: settings.pricePerKwh,
    minMonthlyFeeUsed: settings.minMonthlyFee,
    calculationModeUsed: "cloud",
    settingsVersionUsed: settings.version,
  });
}

module.exports = { calculateReading };
