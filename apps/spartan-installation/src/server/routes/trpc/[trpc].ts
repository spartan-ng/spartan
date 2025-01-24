import { createTrpcNitroHandler } from '@analogjs/trpc';
import { createContext } from '../../trpc/context';
import { appRouter } from '../../trpc/routers';
// export API handler
export default createTrpcNitroHandler({
	router: appRouter,
	createContext,
});
