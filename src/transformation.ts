import { User, DepartmentGroup, DepartmentStats } from './types';

interface InternalDepartmentStats {
  maleCount: number;
  femaleCount: number;
  minAge: number;
  maxAge: number;
  hairCount: Record<string, number>;
  addressUser: Record<string, string>;
}

function initializeDeptStats(): InternalDepartmentStats {
  return {
    maleCount: 0,
    femaleCount: 0,
    minAge: undefined as unknown as number,
    maxAge: undefined as unknown as number,
    hairCount: {},
    addressUser: {},
  };
}

export function transformUsersToDepartment(users: User[]): DepartmentGroup {
  const departmentMap: Record<string, InternalDepartmentStats> = {};

  for (const user of users) {
    const dept = user.company.department;
    if (!departmentMap[dept]) {
      departmentMap[dept] = initializeDeptStats();
    }

    const deptStats = departmentMap[dept];
    const gender = user.gender.toLowerCase();
    if (gender === 'male') deptStats.maleCount++;
    else if (gender === 'female') deptStats.femaleCount++;

    if (deptStats.minAge === undefined || user.age < deptStats.minAge) {
      deptStats.minAge = user.age;
    }
    if (deptStats.maxAge === undefined || user.age > deptStats.maxAge) {
      deptStats.maxAge = user.age;
    }

    const hairColor = user.hair.color;
    deptStats.hairCount[hairColor] = (deptStats.hairCount[hairColor] ?? 0) + 1;

    const fullName = `${user.firstName}${user.lastName}`;
    deptStats.addressUser[fullName] = user.address.postalCode;
  }

  const result: DepartmentGroup = {};
  for (const [departmentName, d] of Object.entries(departmentMap)) {
    const ageRange =
      d.minAge === undefined || d.maxAge === undefined ? 'N/A' : `${d.minAge}-${d.maxAge}`;

    result[departmentName] = {
      male: d.maleCount,
      female: d.femaleCount,
      ageRange,
      hair: d.hairCount,
      addressUser: d.addressUser,
    };
  }

  return result;
}
