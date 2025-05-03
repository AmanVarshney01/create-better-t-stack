import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, required: true },
        image: { type: String },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'user' }
);

const sessionSchema = new Schema(
    {
        _id: { type: String },
        expiresAt: { type: Date, required: true },
        token: { type: String, required: true, unique: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
        ipAddress: { type: String },
        userAgent: { type: String },
        userId: { type: String, ref: 'User', required: true },
    },
    { collection: 'session' }
);

const accountSchema = new Schema(
    {
        _id: { type: String },
        accountId: { type: String, required: true },
        providerId: { type: String, required: true },
        userId: { type: String, ref: 'User', required: true },
        accessToken: { type: String },
        refreshToken: { type: String },
        idToken: { type: String },
        accessTokenExpiresAt: { type: Date },
        refreshTokenExpiresAt: { type: Date },
        scope: { type: String },
        password: { type: String },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
    },
    { collection: 'account' }
);

const verificationSchema = new Schema(
    {
        _id: { type: String },
        identifier: { type: String, required: true },
        value: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date },
        updatedAt: { type: Date },
    },
    { collection: 'verification' }
);

const User = model('User', userSchema);
const Session = model('Session', sessionSchema);
const Account = model('Account', accountSchema);
const Verification = model('Verification', verificationSchema);

export { User, Session, Account, Verification };
