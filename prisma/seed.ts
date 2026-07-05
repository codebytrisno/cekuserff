import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findFirst({
    where: { role: "admin" },
  })

  if (existing) {
    console.log("Admin user already exists:", existing.username ?? existing.email)
    return
  }

  console.log("No admin found. Register via /auth/sign-up then update role manually.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
