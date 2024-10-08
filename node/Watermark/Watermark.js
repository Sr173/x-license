"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Watermark = Watermark;
var React = _interopRequireWildcard(require("react"));
var _useLicenseVerifier = require("../useLicenseVerifier");
var _licenseStatus = require("../utils/licenseStatus");
var _jsxRuntime = require("react/jsx-runtime");
function getLicenseErrorMessage(licenseStatus) {
  switch (licenseStatus) {
    case _licenseStatus.LICENSE_STATUS.ExpiredAnnualGrace:
    case _licenseStatus.LICENSE_STATUS.ExpiredAnnual:
      return 'MUI X Expired license key';
    case _licenseStatus.LICENSE_STATUS.ExpiredVersion:
      return 'MUI X Expired package version';
    case _licenseStatus.LICENSE_STATUS.Invalid:
      return 'MUI X Invalid license key';
    case _licenseStatus.LICENSE_STATUS.OutOfScope:
      return 'MUI X License key plan mismatch';
    case _licenseStatus.LICENSE_STATUS.NotAvailableInInitialProPlan:
      return 'MUI X Product not covered by plan';
    case _licenseStatus.LICENSE_STATUS.NotFound:
      return 'MUI X Missing license key';
    default:
      throw new Error('Unhandled MUI X license status.');
  }
}
function Watermark(props) {
  const {
    packageName,
    releaseInfo
  } = props;
  const licenseStatus = (0, _useLicenseVerifier.useLicenseVerifier)(packageName, releaseInfo);
  if (licenseStatus.status === _licenseStatus.LICENSE_STATUS.Valid) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
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