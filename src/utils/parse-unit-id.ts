export function parseUnitId(unitId: string) {
    if (unitId.length <= 3) {
        return `Casa ${unitId}`;
    } else {
        const apto = unitId.slice(-3); // get last three characters
        const tower = unitId.slice(0, -3); // get all characters before the last three
        return `Torre ${tower} Apto. ${apto}`;
    }
}

export function parseUnitIdValues(unitId: string) {
    if (unitId.length <= 3) {
        return { tower: '', unit: unitId};
    } else {
        const apto = unitId.slice(-3); // get last three characters
        const tower = unitId.slice(0, -3); // get all characters before the last three
        return { tower: tower, unit: apto }
    }
}