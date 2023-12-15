export function cleanTowerUnitValues(tower: string | undefined, unit: string): [string, string, string] {
    // Trim and convert to uppercase
    const cleanTower = tower ? tower.trim().toUpperCase() : '';
    const cleanUnit = unit.trim().toUpperCase();
    const unitId = cleanTower + cleanUnit;
  
    return [cleanTower, cleanUnit, unitId];
  }