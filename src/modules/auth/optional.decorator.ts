import { SetMetadata } from 'typedi';

export const IS_PRIVATE = 'IS_PRIVATE';
export const Private = () => SetMetadata(IS_PRIVATE, true);
