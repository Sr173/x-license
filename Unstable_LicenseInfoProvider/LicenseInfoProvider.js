import * as React from 'react';
import MuiLicenseInfoContext from "./MuiLicenseInfoContext.js";

/**
 * @ignore - do not document.
 */
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @ignore - do not document.
 */
export function LicenseInfoProvider({
  info,
  children
}) {
  return /*#__PURE__*/_jsx(MuiLicenseInfoContext.Provider, {
    value: info,
    children: children
  });
}