/**
 *
 */
export function sleepMsec(msec: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, msec);
	});
}