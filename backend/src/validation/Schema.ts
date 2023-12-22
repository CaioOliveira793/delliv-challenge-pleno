import { z } from 'zod';

const ULID_LENGTH = 26;

const ULID_REGEX = /^[\dABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

export const UlidSchema = z.string().length(ULID_LENGTH).regex(ULID_REGEX);

export const PersonNameSchema = z.string().min(2).max(255);
