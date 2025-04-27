import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, anonymous, emailOTP, twoFactor, username } from "better-auth/plugins";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import FastifyBetterAuth from 'fastify-better-auth';
import fp from 'fastify-plugin';
import prisma from "prisma";

export const auth = (fastify: FastifyInstance) => betterAuth({
 database: prismaAdapter(prisma, {
  provider: 'mongodb'
 }),
 appName: 'my-app',
 trustedOrigins: [
  process.env.CORS_ORIGIN || "",
 ],
 emailAndPassword: {
  enabled: true,
 }
 // Removed duplicate trustedOrigins property
});


async function authPlugin(fastify: FastifyInstance) {
 await fastify.register(fp((instance, opts, done) => {
  FastifyBetterAuth(instance, { auth: auth(fastify) });
  done();
 }));
}

export default fp(authPlugin as unknown as FastifyPluginAsync, {
 name: 'auth-plugin',
});


