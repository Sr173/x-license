// eslint-disable-next-line @typescript-eslint/naming-convention
export let LICENSE_STATUS = /*#__PURE__*/function (LICENSE_STATUS) {
  LICENSE_STATUS["NotFound"] = "NotFound";
  LICENSE_STATUS["Invalid"] = "Invalid";
  LICENSE_STATUS["ExpiredAnnual"] = "ExpiredAnnual";
  LICENSE_STATUS["ExpiredAnnualGrace"] = "ExpiredAnnualGrace";
  LICENSE_STATUS["ExpiredVersion"] = "ExpiredVersion";
  LICENSE_STATUS["Valid"] = "Valid";
  LICENSE_STATUS["OutOfScope"] = "OutOfScope";
  LICENSE_STATUS["NotAvailableInInitialProPlan"] = "NotAvailableInInitialProPlan";
  return LICENSE_STATUS;
}({});