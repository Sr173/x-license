import * as React from 'react';
import { useLicenseVerifier } from "../useLicenseVerifier/index.js";
import { LICENSE_STATUS } from "../utils/licenseStatus.js";
import { jsx as _jsx } from "react/jsx-runtime";
function getLicenseErrorMessage(licenseStatus) {
  switch (licenseStatus) {
    case LICENSE_STATUS.ExpiredAnnualGrace:
    case LICENSE_STATUS.ExpiredAnnual:
      return 'MUI X Expired license key';
    case LICENSE_STATUS.ExpiredVersion:
      return 'MUI X Expired package version';
    case LICENSE_STATUS.Invalid:
      return 'MUI X Invalid license key';
    case LICENSE_STATUS.OutOfScope:
      return 'MUI X License key plan mismatch';
    case LICENSE_STATUS.NotAvailableInInitialProPlan:
      return 'MUI X Product not covered by plan';
    case LICENSE_STATUS.NotFound:
      return 'MUI X Missing license key';
    default:
      throw new Error('Unhandled MUI X license status.');
  }
}
export function Watermark(props) {
  const {
    packageName,
    releaseInfo
  } = props;
  const licenseStatus = useLicenseVerifier(packageName, releaseInfo);
  if (licenseStatus.status === LICENSE_STATUS.Valid) {
    return null;
  }
  return /*#__PURE__*/_jsx("div", {
    style: {
      position: 'absolute',
      pointerEvents: 'none',
      color: '#8282829e',
      zIndex: 100000,
      width: '100%',
      textAlign: 'center',
      bottom: '50%',
      right: 0,
      letterSpacing: 5,
      fontSize: 24
    },
    children: getLicenseErrorMessage(licenseStatus.status)
  });
}