type ReturnDataTyped<T> = {
	success: boolean;
	message: string;
	data?: T;
	error?: any;
  };