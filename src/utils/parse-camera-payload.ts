import { writeFile, writeFileSync } from 'fs';

const PAYLOAD_PREFIX = 'data:image/png;base64,';

export const parseCameraPayload = (payload: string) => {
	if (!payload.startsWith(PAYLOAD_PREFIX)) {
		throw new Error(`Camera payload must start with prefix ${PAYLOAD_PREFIX}.`);
	}

	const [, encoded] = payload.split(',');
	const normalizedPayload = encoded.replace(/ /g, '+');

	return Buffer.from(normalizedPayload, 'base64');
};
