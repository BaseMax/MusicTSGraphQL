import { SetMetadata } from '@nestjs/common';

export const IS_PRIVATE = 'IS_PRIVATE';
export const Private = () => SetMetadata(IS_PRIVATE, true);
