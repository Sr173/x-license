import { base64Decode, base64Encode } from "../encoding/base64.js";
import { md5 } from "../encoding/md5.js";
import { LICENSE_STATUS } from "../utils/licenseStatus.js";
import { PLAN_SCOPES } from "../utils/plan.js";
import { LICENSE_MODELS } from "../utils/licenseModel.js";
const getDefaultReleaseDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
export function generateReleaseInfo(releaseDate = getDefaultReleaseDate()) {
  return base64Encode(releaseDate.getTime().toString());
}
function isPlanScopeSufficient(packageName, planScope) {
  let acceptedScopes;
  if (packageName.includes('-pro')) {
    acceptedScopes = ['pro', 'premium'];
  } else if (packageName.includes('-premium')) {
    acceptedScopes = ['premium'];
  } else {
    acceptedScopes = [];
  }
  return acceptedScopes.includes(planScope);
}
const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;
const PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN = ['x-data-grid-pro', 'x-date-pickers-pro'];

/**
 * Format: ORDER:${orderNumber},EXPIRY=${expiryTimestamp},KEYVERSION=1
 */
const decodeLicenseVersion1 = license => {
  let expiryTimestamp;
  try {
    expiryTimestamp = parseInt(license.match(expiryReg)[1], 10);
    if (!expiryTimestamp || Number.isNaN(expiryTimestamp)) {
      expiryTimestamp = null;
    }
  } catch (err) {
    expiryTimestamp = null;
  }
  return {
    planScope: 'pro',
    licenseModel: 'perpetual',
    expiryTimestamp,
    planVersion: 'initial'
  };
};

/**
 * Format: O=${orderNumber},E=${expiryTimestamp},S=${planScope},LM=${licenseModel},PV=${planVersion},KV=2`;
 */
const decodeLicenseVersion2 = license => {
  const licenseInfo = {
    planScope: null,
    licenseModel: null,
    expiryTimestamp: null,
    planVersion: 'initial'
  };
  license.split(',').map(token => token.split('=')).filter(el => el.length === 2).forEach(([key, value]) => {
    if (key === 'S') {
      licenseInfo.planScope = value;
    }
    if (key === 'LM') {
      licenseInfo.licenseModel = value;
    }
    if (key === 'E') {
      const expiryTimestamp = parseInt(value, 10);
      if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
        licenseInfo.expiryTimestamp = expiryTimestamp;
      }
    }
    if (key === 'PV') {
      licenseInfo.planVersion = value;
    }
  });
  return licenseInfo;
};

/**
 * Decode the license based on its key version and return a version-agnostic `MuiLicense` object.
 */
const decodeLicense = encodedLicense => {
  const license = base64Decode(encodedLicense);
  if (license.includes('KEYVERSION=1')) {
    return decodeLicenseVersion1(license);
  }
  if (license.includes('KV=2')) {
    return decodeLicenseVersion2(license);
  }
  return null;
};
export function verifyLicense({
  releaseInfo,
  licenseKey,
  packageName
}) {
  if (!releaseInfo) {
    throw new Error('MUI X: The release information is missing. Not able to validate license.');
  }
  if (!licenseKey) {
    return {
      status: LICENSE_STATUS.NotFound
    };
  }
  const hash = licenseKey.substr(0, 32);
  const encoded = licenseKey.substr(32);
  if (hash !== md5(encoded)) {
    return {
      status: LICENSE_STATUS.Invalid
    };
  }
  const license = decodeLicense(encoded);
  if (license == null) {
    console.error('MUI X: Error checking license. Key version not found!');
    return {
      status: LICENSE_STATUS.Invalid
    };
  }
  if (license.licenseModel == null || !LICENSE_MODELS.includes(license.licenseModel)) {
    console.error('MUI X: Error checking license. Licensing model not found or invalid!');
    return {
      status: LICENSE_STATUS.Invalid
    };
  }
  if (license.expiryTimestamp == null) {
    console.error('MUI X: Error checking license. Expiry timestamp not found or invalid!');
    return {
      status: LICENSE_STATUS.Invalid
    };
  }
  if (license.licenseModel === 'perpetual' || process.env.NODE_ENV === 'production') {
    const pkgTimestamp = parseInt(base64Decode(releaseInfo), 10);
    if (Number.isNaN(pkgTimestamp)) {
      throw new Error('MUI X: The release information is invalid. Not able to validate license.');
    }
    if (license.expiryTimestamp < pkgTimestamp) {
      return {
        status: LICENSE_STATUS.ExpiredVersion
      };
    }
  } else if (license.licenseModel === 'subscription' || license.licenseModel === 'annual') {
    if (new Date().getTime() > license.expiryTimestamp) {
      if (
      // 30 days grace
      new Date().getTime() < license.expiryTimestamp + 1000 * 3600 * 24 * 30 || process.env.NODE_ENV !== 'development') {
        return {
          status: LICENSE_STATUS.ExpiredAnnualGrace,
          meta: {
            expiryTimestamp: license.expiryTimestamp,
            licenseKey
          }
        };
      }
      return {
        status: LICENSE_STATUS.ExpiredAnnual,
        meta: {
          expiryTimestamp: license.expiryTimestamp,
          licenseKey
        }
      };
    }
  }
  if (license.planScope == null || !PLAN_SCOPES.includes(license.planScope)) {
    console.error('MUI X: Error checking license. planScope not found or invalid!');
    return {
      status: LICENSE_STATUS.Invalid
    };
  }
  if (!isPlanScopeSufficient(packageName, license.planScope)) {
    return {
      status: LICENSE_STATUS.OutOfScope
    };
  }

  // 'charts-pro' or 'tree-view-pro' can only be used with a newer Pro license
  if (license.planVersion === 'initial' && license.planScope === 'pro' && !PRO_PACKAGES_AVAILABLE_IN_INITIAL_PRO_PLAN.includes(packageName)) {
    return {
      status: LICENSE_STATUS.NotAvailableInInitialProPlan
    };
  }
  return {
    status: LICENSE_STATUS.Valid
  };
}