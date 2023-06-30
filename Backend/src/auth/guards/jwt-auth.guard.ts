/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/utils/decorators/public.decorator";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

	constructor (private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const	isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[
				context.getHandler(),
				context.getClass(),
			],
		);
		
		if (isPublic)
			return true;
		
		return super.canActivate(context);
	}
}
