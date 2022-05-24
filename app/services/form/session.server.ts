import {
  Cookie,
  createCookieSessionStorage,
  createSessionStorage,
} from "@remix-run/node";
import { prisma } from "~/db.server";

// import {
//   getSession,
//   commitSession,
//   destroySession,
// } from "./redis-session.server";

// function createDatabaseSessionStorage({ cookie }: { cookie: Cookie }) {
//   return createSessionStorage({
//     cookie,
//     async createData(data, expires) {
//       const { id } = await prisma.session.create({
//         data: {
//           ...data,
//         },
//       });
//       return id;
//     },
//     async readData(id) {
//       return (
//         (await prisma.session.findFirst({
//           where: {
//             id,
//           },
//         })) || null
//       );
//     },
//     async updateData(id, data, expires) {
//       await prisma.session.update({
//         where: {
//           id,
//         },
//         data: {
//           ...data,
//         },
//       });
//     },
//     async deleteData(id) {
//       await prisma.session.delete({
//         where: {
//           id,
//         },
//       });
//     },
//   });
// }

// const { getSession, commitSession, destroySession } =
//   createDatabaseSessionStorage({
//     cookie: {
//       name: "__form_cookie",
//       // @ts-ignore
//       secure: process.env.NODE_ENV === "production", // enable this in prod only,
//       httpOnly: true,
//       path: "/",
//       sameSite: "lax",
//       secrets: [process.env.FORM_SESSION_SECRET ?? "S3cr3tS3cr3ts"],
//     },
//   });

// eslint-disable-next-line @typescript-eslint/unbound-method
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__new_call",
      maxAge: 30,
      secure: process.env.NODE_ENV === "production", // enable this in prod only,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.FORM_SESSION_SECRET ?? "S3cr3tS3cr3ts"],
    },
  });

export { getSession, commitSession, destroySession };
