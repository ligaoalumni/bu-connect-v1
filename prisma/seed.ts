const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
	await prisma.user.createMany({
		data: [
			{
				id: -1,
				password:
					"$2a$10$8YNEj3X.yVlzKRUU8CVFO.ykXQSHJQS2gd3d6RCzXkyBEeaDm9F/.",
				birthDate: new Date("2000-01-01"),
				email: "ligaoalumni@gmail.com",
				role: "SUPER_ADMIN",
				firstName: "Ligao",
				lastName: "Alumni",
				status: "ACTIVE",
				verifiedAt: new Date(),
			},
		],
	});
})();
