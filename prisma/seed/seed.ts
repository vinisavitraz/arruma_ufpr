import { permission, PrismaClient, role, role_permission, user } from '@prisma/client';

const prisma  = new PrismaClient();

async function main() {
  
  const teacherRole: role = await prisma.role.upsert({
    where: { key: 'teacher' },
    update: {},
    create: {
      name: 'Professor',
      key: 'teacher',
    },
  });

  const studentRole: role = await prisma.role.upsert({
    where: { key: 'student' },
    update: {},
    create: {
      name: 'Estudante',
      key: 'student',
    },
  });

  const listUserPermission: permission = await prisma.permission.upsert({
    where: { key: 'list_user' },
    update: {},
    create: {
      name: 'Listar usuário',
      key: 'list_user',
    },
  });

  const createUserPermission: permission = await prisma.permission.upsert({
    where: { key: 'create_user' },
    update: {},
    create: {
      name: 'Criar usuário',
      key: 'create_user',
    },
  });

  const createLocationPermission: permission = await prisma.permission.upsert({
    where: { key: 'create_location' },
    update: {},
    create: {
      name: 'Criar local',
      key: 'create_location',
    },
  });

  const allIncidentsPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'all_incidents_page' },
    update: {},
    create: {
      name: 'Página `Listar incidentes`',
      key: 'all_incidents_page',
    },
  });

  const incidentsPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'incidents_page' },
    update: {},
    create: {
      name: 'Página `Listar meus incidentes`',
      key: 'incidents_page',
    },
  });

  const createIncidentPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'create_incident_page' },
    update: {},
    create: {
      name: 'Página `Criar incidente`',
      key: 'create_incident_page',
    },
  });

  const incidentTypesPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'incident_types_page' },
    update: {},
    create: {
      name: 'Página `Listar tipos de incidente`',
      key: 'incident_types_page',
    },
  });

  const createIncidentTypePagePermission: permission = await prisma.permission.upsert({
    where: { key: 'create_incident_type_page' },
    update: {},
    create: {
      name: 'Página `Criar tipo de incidente`',
      key: 'create_incident_type_page',
    },
  });

  const locationPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'locations_page' },
    update: {},
    create: {
      name: 'Página `Listar locais`',
      key: 'locations_page',
    },
  });

  const createLocationPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'create_location_page' },
    update: {},
    create: {
      name: 'Página `Criar local`',
      key: 'create_location_page',
    },
  });

  const deleteLocationPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'delete_location_page' },
    update: {},
    create: {
      name: 'Página `Deletar local`',
      key: 'delete_location_page',
    },
  });

  const itemsPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'items_page' },
    update: {},
    create: {
      name: 'Página `Listar itens`',
      key: 'items_page',
    },
  });

  const createItemPagePermission: permission = await prisma.permission.upsert({
    where: { key: 'create_item_page' },
    update: {},
    create: {
      name: 'Página `Criar item`',
      key: 'create_item_page',
    },
  });

  const listUserTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: listUserPermission.id,
    },
  });

  const listUserStudentRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: studentRole.id,
      permission_id: listUserPermission.id,
    },
  });

  const createUserTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createUserPermission.id,
    },
  });

  const createLocationTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createLocationPermission.id,
    },
  });

  const listAllIncidentsTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: allIncidentsPagePermission.id,
    },
  });

  const listIncidentsTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: incidentsPagePermission.id,
    },
  });

  const createIncidentTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createIncidentPagePermission.id,
    },
  });

  const incidentTypesTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: incidentTypesPagePermission.id,
    },
  });

  const createIncidentTypeTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createIncidentTypePagePermission.id,
    },
  });

  const listLocationsTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: locationPagePermission.id,
    },
  });

  const createLocationPageTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createLocationPagePermission.id,
    },
  });

  const deleteLocationPageTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: deleteLocationPagePermission.id,
    },
  });

  const listItemsTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: itemsPagePermission.id,
    },
  });

  const createItemTeacherRolePermission: role_permission = await prisma.role_permission.create({
    data: {
      role_id: teacherRole.id,
      permission_id: createItemPagePermission.id,
    },
  });

  const userTeacher: user = await prisma.user.upsert({
    where: { email: 't@mail' },
    update: {},
    create: {
      email: 't@mail',
      password: '$2b$10$sNMPhHviR4DMUgPDc8QUyeeTWZGxVyiEDY94KxySZegcLr5ai/MIC',
      name: 'Professor 1',
      role_id: teacherRole.id,
    },
  });

  const userStudent: user = await prisma.user.upsert({
    where: { email: 's@mail' },
    update: {},
    create: {
      email: 's@mail',
      password: '$2b$10$sNMPhHviR4DMUgPDc8QUyeeTWZGxVyiEDY94KxySZegcLr5ai/MIC',
      name: 'Estudante 1',
      role_id: studentRole.id,
    },
  });

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })