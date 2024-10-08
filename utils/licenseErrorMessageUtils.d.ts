export declare function showInvalidLicenseKeyError(): void;
export declare function showLicenseKeyPlanMismatchError(): void;
export declare function showNotAvailableInInitialProPlanError(): void;
export declare function showMissingLicenseKeyError({ plan, packageName, }: {
    plan: string;
    packageName: string;
}): void;
export declare function showExpiredPackageVersionError({ packageName }: {
    packageName: string;
}): void;
export declare function showExpiredAnnualGraceLicenseKeyError({ plan, licenseKey, expiryTimestamp, }: {
    plan: string;
    licenseKey: string;
    expiryTimestamp: number;
}): void;
export declare function showExpiredAnnualLicenseKeyError({ plan, licenseKey, expiryTimestamp, }: {
    plan: string;
    licenseKey: string;
    expiryTimestamp: number;
}): void;
