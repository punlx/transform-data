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
    minAge: Number.MAX_SAFE_INTEGER,
    maxAge: Number.MIN_SAFE_INTEGER,
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

    if (user.gender.toLowerCase() === 'male') {
      deptStats.maleCount++;
    } else if (user.gender.toLowerCase() === 'female') {
      deptStats.femaleCount++;
    }

    if (user.age < deptStats.minAge) {
      deptStats.minAge = user.age;
    }
    if (user.age > deptStats.maxAge) {
      deptStats.maxAge = user.age;
    }

    const hairColor = user.hair.color;
    if (!deptStats.hairCount[hairColor]) {
      deptStats.hairCount[hairColor] = 0;
    }
    deptStats.hairCount[hairColor]++;

    const fullName = `${user.firstName}${user.lastName}`;
    deptStats.addressUser[fullName] = user.address.postalCode;
  }

  const result: DepartmentGroup = {};

  for (const departmentName of Object.keys(departmentMap)) {
    const d = departmentMap[departmentName];
    const stats: DepartmentStats = {
      male: d.maleCount,
      female: d.femaleCount,
      ageRange: `${d.minAge}-${d.maxAge}`,
      hair: { ...d.hairCount },
      addressUser: { ...d.addressUser },
    };
    result[departmentName] = stats;
  }

  return result;
}
