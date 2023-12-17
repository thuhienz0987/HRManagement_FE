function allowRows(roles: string[], userRoles: string[]) {
  let allow = false;
  roles.map((role) => {
    if (userRoles.includes(role)) allow = true;
  });
  return allow;
}

export default allowRows;
