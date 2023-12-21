import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';
import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';
import { logLevel } from '@/config/ConfigOptions';
import { RequestValidationError } from '@/exception/validation/RequestValidationError';
import { RequestSegment } from '@/http/types';
import { DataIssueType } from '@/common/type';
import { removeStackTrace } from '@/util/error';

const BODY_LIMIT = 20 * 1024 * 1024; // 20MB
const CONNECTION_TIMEOUT = 10_000; // 10sec
const KEEP_ALIVE_TIMEOUT = 90_000; // 1min 30sec

export function fastifyInstance(): FastifyInstance {
	const instance = fastify({
		logger: { level: logLevel() },
		bodyLimit: BODY_LIMIT,
		connectionTimeout: CONNECTION_TIMEOUT,
		keepAliveTimeout: KEEP_ALIVE_TIMEOUT,
		ignoreTrailingSlash: false,
		maxParamLength: 64,
	});

	instance.removeContentTypeParser('application/json');
	instance.addContentTypeParser('application/json', { parseAs: 'string' }, jsonContentTypeParser);

	instance.register(cors, { origin: true });

	return instance;
}

function jsonContentTypeParser(
	request: FastifyRequest,
	body: string,
	done: ContentTypeParserDoneFunction
) {
	try {
		const json = JSON.parse(body, reviver);
		done(null, json);
	} catch (err: unknown) {
		const parseError = err as Error;
		const error = new RequestValidationError(RequestSegment.Body, [
			{
				message: parseError.message,
				path: null,
				type: DataIssueType.InvalidContent,
			},
		]);
		request.log.info(removeStackTrace(error, true), error.message);
		done(error, undefined);
	}
}

function reviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}
