class CommonException extends Error {
	constructor(message, status, errorCode) {
		super(message)

		this.status = status || 500
		this.errorCode = errorCode || 'INTERNAL_SERVER_ERROR'
		Error.captureStackTrace(this, this.constructor)
	}
}

class IncorrectPermission extends CommonException {
	constructor(message, status, errorCode) {
		super(message || 'Do not have permission', status || 403, errorCode || 403)
	}
}

class BadRequestException extends CommonException {
	constructor(message, status, errorCode) {
		super(message || 'Request incorrect', status || 400, errorCode || 400)
	}
}
class TargetNotExistException extends CommonException {
	constructor(message, status, errorCode) {
		super(message || 'Target not exist', status || 404, errorCode || 404)
	}
}

class TargetAlreadyExistException extends CommonException {
	constructor(message, status, errorCode) {
		super(message || 'Target already exist', status || 409, errorCode || 409)
	}
}

module.exports = {
	CommonException,
	IncorrectPermission,
	BadRequestException,
	TargetNotExistException,
	TargetAlreadyExistException,
}
