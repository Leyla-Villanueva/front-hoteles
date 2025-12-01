//no hay back aun

export function currentUser() {
    return {
        id: 'u123',
        name: 'Recepción Usuario',
        roles: ['reception', 'cleaning']
    };
}


export function hasRole(role) {
    const u = currentUser();
    return u.roles.includes(role);
}