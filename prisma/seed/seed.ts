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