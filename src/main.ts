

/*
Вопросы и пожелания

function getEnumValue(key: string, t:any): typeof t | undefined {
  let value = undefined;

  if (Object.values(t).includes(key)){
    value = t[key] as typeof t;
  }
  console.log(value);

  return value;
}

//function test<T extends string | number>(): {[key in T]: string} | null {
//  return null;
//}
//const obj = test<Role>();
//obj.

enum Role {
  Admin = 'Admin',
  User = 'User'
}

function getFirstRoleValue(): string{
  return 'Super' + 'Admin'
}

function getSecondRoleValue(): string{
  return 'Admin'
}

const firstRoleValue = getFirstRoleValue();
const firstRole = Role[firstRoleValue as Role];

console.log(firstRole)

const secondRoleValue = getSecondRoleValue();
const secondRole = Role[secondRoleValue as Role];

console.log(secondRole)

console.log(getEnumValue('super', Role));
console.log(getEnumValue('Admin', Role));

*/
